import { join, isAbsolute } from "https://deno.land/std@0.106.0/path/mod.ts";
import { BufReader } from "https://deno.land/std@0.106.0/io/mod.ts";

export class Docs
{
	private docs!: string;

	constructor( docs: string )
	{
		if ( isAbsolute( docs) )
		{
			this.docs = docs;
		} else
		{
			this.docs = join( Deno.cwd(), docs );
		}
	}

	public async read( path: string )
	{
		const file = await Deno.open( this.path( path ) );

		return BufReader.create( file );
	}

	public async readDirectoryIndex( dir: string, indexes: string [] )
	{
		for ( let index of indexes )
		{
			try
			{
				const path = [ dir, index ].join( '' );
				const file = await this.read( path );

				return { path: path, file: file };
			} catch ( error )
			{
				console.log( error );
				continue;
			}
		}

		return Promise.reject( new Error( 'Notfound.' ) );
	}

	public path( path: string )
	{
		return join( this.docs, path );
	}
}
