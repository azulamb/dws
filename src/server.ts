import { serve, HTTPOptions, ServerRequest } from 'https://deno.land/std@0.106.0/http/server.ts';
import { Config } from './config.ts';
import { Docs } from './docs.ts';
import { Mime } from './mime.ts';

export class WebServer
{
	private docs!: Docs;
	private oprion!: HTTPOptions;
	private mime!: Mime;
	private headers!: Headers;
	private indexes!: string[];

	public isDebug: boolean = true;

	constructor()
	{
		this.isDebug = typeof Deno.env.get( 'DWS_DEBUG' ) === 'string';
		this.setDocs( './docs' );
		this.setOption( { port: 8080 } );
		this.setMime( new Mime(
		{
			bmp: 'image/bmp',
			css: 'text/css',
			csv: 'text/csv',
			gif: 'image/gif',
			gz: 'application/gzip',
			html: 'text/html',
			ico: 'image/x-icon',
			jpg: 'image/jpeg',
			js: 'text/javascript',
			json: 'application/json',
			jsonp: 'application/javascript',
			pdf: 'application/pdf',
			png: 'image/png',
			svg: 'image/svg+xml',
			svgz: 'image/svg+xml',
			txt: 'text/plain',
			zip: 'application/zip',
			wasm: 'application/wasm',
			webp: 'image/webp',
		} ) );
		this.setHeaders( new Headers() );
		this.setDirectoryIndex( [ 'index.html' ] );
	}

	public setDocs( docs: string|Docs )
	{
		this.docs = typeof docs === 'string' ? new Docs( docs ) : docs;
	}

	public setOption( oprion: HTTPOptions )
	{
		this.oprion = oprion;
	}

	public setMime( mime: Mime )
	{
		this.mime = mime;
	}

	public addMime( mime: Mime )
	{
		this.mime.merge( mime );
	}

	public setHeaders( headers: Headers )
	{
		this.headers = headers;
	}

	public setDirectoryIndex( indexes: string[] )
	{
		this.indexes = indexes;
	}

	public async run()
	{
		const server = serve( this.oprion );

		this.debug( this.oprion );

		for await (const request of server)
		{
			this.onRequest( request );
		}
	}

	protected async onRequest( request: ServerRequest )
	{
		const path = request.url;

		return this.readFile( path ).then( ( result ) =>
		{
			this.debug( `${ path } ${ 200 } ${ result.path }` );
			return request.respond(
			{
				body: result.file,
				status: 200,
				headers: this.createHeaders( result.path ),
			} );
		} ).catch( ( error ) =>
		{
			this.debug( `${ path } ${ 404 } ${ path }` );
			return request.respond(
			{
				body: '404 Notfound.',
				status: 404,
				headers: this.createHeaders(),
			} );
		} );
	}

	protected readFile( path: string )
	{
		if ( path.match( /\/$/ ) )
		{
			return this.docs.readDirectoryIndex( path, this.indexes );
		}

		return this.docs.read( path ).then( ( file ) =>
		{
			return { path: path, file: file };
		} );
	}

	protected createHeaders( path?: string )
	{
		const headers = new Headers( this.headers );

		if ( path )
		{
			const mime = this.mime.get( path );
			if ( mime )
			{
				headers.set( 'Content-Type', mime );
			}
		}

		return headers;
	}

	protected debug( ... data: any[] )
	{
		if ( !this.isDebug ) { return; }
		console.log( ... data );
	}
}

if ( import.meta.main )
{
	const server = new WebServer();

	( () =>
	{
		const file = Deno.env.get( 'DWS_CONFIG' );
		if ( file )
		{
			const config = new Config();
			return config.load( file ).then( () =>
			{
				server.setOption( config.http );
				server.setDocs( config.docs );
				server.addMime( new Mime( config.mime ) );
				server.setHeaders( new Headers( config.headers ) );
			} ).catch( () => {} );
		}

		const port = parseInt( Deno.env.get( 'DWS_PORT' ) || '' );
		if ( port )
		{
			server.setOption( { port: port } );
		}
		const docs = Deno.env.get( 'DWS_DOCS' );
		if ( typeof docs === 'string' )
		{
			server.setDocs( docs );
		}

		return Promise.resolve();
	} )().then( () =>
	{
		server.run();
	} );
}
