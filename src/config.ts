import { HTTPOptions } from 'https://deno.land/std@0.106.0/http/server.ts';

interface ServerConfig
{
	http?: HTTPOptions;
	docs?: string;
	mime?: { [ keys: string ]: string };
	headers?: { [ keys: string ]: string },
	indexes?: string[],
}

export class Config
{
	private config!: ServerConfig;

	constructor()
	{
		this.config = {};
	}

	public load( file: string )
	{
		return Deno.readTextFile( file ).then( ( data ) =>
		{
			return JSON.parse( data );
		} ).then( ( data: ServerConfig ) =>
		{
			if ( typeof data.http === 'object' )
			{
				if ( typeof data.http.port === 'number' )
				{
					this.config.http = { port: data.http.port };
					if ( typeof data.http.hostname === 'string' )
					{
						this.config.http.hostname = data.http.hostname;
					}
				}
			}
			if ( typeof data.docs === 'string' )
			{
				this.config.docs = data.docs;
			}
			if ( typeof data.mime === 'object' )
			{
				this.config.mime = data.mime;
			}
			if ( typeof data.headers === 'object' )
			{
				this.config.headers = data.headers;
			}
			if ( Array.isArray( data.indexes ) )
			{
				this.config.indexes = data.indexes;
			}
		} );
	}

	public get http(): HTTPOptions { return this.config.http || { port: 8080 }; }

	public get docs() { return typeof this.config.docs === 'string' ? this.config.docs : './docs'; }

	public get mime() { return this.config.mime || {}; }

	public get headers() { return this.config.headers || {}; }

	public get indexes() { return this.config.indexes || [ 'index.html' ]; }
}
