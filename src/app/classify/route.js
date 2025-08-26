// Create a custom request handler for the /classify route.
// For more information, see https://nextjs.org/docs/app/building-your-application/routing/router-handlers

import { NextResponse } from 'next/server'
import PipelineSingleton from './pipeline.js';

// Force dynamic rendering to prevent caching issues with large models
export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const text = request.nextUrl.searchParams.get('text');
        const src_lang = request.nextUrl.searchParams.get('src_lang') || 'eng_Latn'; // Hindi
        const tgt_lang = request.nextUrl.searchParams.get('tgt_lang') || 'hin_Deva'; // French
        // const src_lang = request.nextUrl.searchParams.get('src_lang') || 'en'; // Hindi
        // const tgt_lang = request.nextUrl.searchParams.get('tgt_lang') || 'hin_Deva'; // French
        
        if (!text) {
            return NextResponse.json({
                error: 'Missing text parameter',
            }, { status: 400 });
        }
        
        // Get the translation pipeline. When called for the first time,
        // this will load the pipeline and cache it for future use.
        const translator = await PipelineSingleton.getInstance();

        // Actually perform the translation
        const result = await translator(text, {
            src_lang: src_lang,
            tgt_lang: tgt_lang,
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({
            error: 'Translation failed',
            details: error.message
        }, { status: 500 });
    }
}

