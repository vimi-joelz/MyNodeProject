import Fastify from 'fastify';
import {cors} from  '@fastify/cors';
import {fileURLToPath} from 'url';
import process from 'process';
import path from 'path';
import pg from 'pg';

const app = Fastify({logger: true});

type httpStatus = {
 ok: number;
 error: number;
 notFound: number;
 forbidden: number;
 authenticationFailed: number;
 serverError: number;
}

const status: Pick<httpStatus,'ok'|'error'|'notFound'|'forbidden'|'serverError'> = {
 ok: 200,
 error: 401,
 notFound: 404,
 forbidden: 403,
 serverError: 500
}

