import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No se incluyó ningún archivo' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const timestamp = Date.now();
    // Limpieza de nombre
    const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
    const filename = `${timestamp}-${cleanName}`;
    
    // Subida a la carpeta de cotizaciones en Bunny.net
    const zoneUrl = `https://storage.bunnycdn.com/cesarweb/Hidromasaje-Aquatech/cotizaciones/${filename}`;

    const response = await fetch(zoneUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': process.env.BUNNY_STORAGE_PASSWORD || '',
        'Content-Type': 'application/octet-stream',
      },
      body: arrayBuffer,
    });

    if (response.ok) {
      const publicUrl = `https://cesarweb.b-cdn.net/Hidromasaje-Aquatech/cotizaciones/${filename}`;
      return NextResponse.json({ url: publicUrl });
    } else {
      const errorText = await response.text();
      return NextResponse.json({ error: `Fallo CDN: ${errorText}` }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
