import { extname } from "https://deno.land/std@0.106.0/path/mod.ts";

export class Mime
{
	private mime: { [ keys: string ]: string } = {};
	constructor( mime?: { [ keys: string ]: string } )
	{
		if ( mime ) { this.set( mime ); }
	}

	public set( mime: { [ keys: string ]: string } )
	{
		Object.keys( mime ).forEach( ( key )=>
		{
			this.add( key, mime[ key ] );
		} );
	}

	public add( ext: string, mime: string )
	{
		this.mime[ ext.match( /^\./ ) ? ext : '.' + ext ] = mime;
	}

	public remove( ... exts: string[] )
	{
		exts.forEach( ( ext ) =>
		{
			delete this.mime[ ext ];
		} );
	}

	public clear()
	{
		this.mime = {};
	}

	public get( path: string )
	{
		const ext = extname( path );

		return this.mime[ ext ] || '';
	}

	public merge( from: Mime )
	{
		this.set( from.mime );
	}
}
