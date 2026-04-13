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
    
    // Use standard hostname if specific one is not provided
    const storageHost = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
    const storageZone = process.env.BUNNY_STORAGE_ZONE || 'cesarweb';
    const accessKey = process.env.BUNNY_STORAGE_API_KEY || '';
    
    // Ensure filename is clean
    const cleanFilename = filename.toLowerCase();
    const zoneUrl = `https://${storageHost}/${storageZone}/Hidromasaje-Aquatech/cotizaciones/${cleanFilename}`;

    console.log(`[Upload API] Target: ${zoneUrl}`);

    const response = await fetch(zoneUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(arrayBuffer), // Convert to Buffer for better compatibility with some fetch environments
    });

    if (response.ok) {
      const pullZoneUrl = process.env.BUNNY_PULLZONE_URL || 'https://cesarweb.b-cdn.net';
      const publicUrl = `${pullZoneUrl}/Hidromasaje-Aquatech/cotizaciones/${filename}`;
      console.log(`[Upload API] Éxito: ${publicUrl}`);
      return NextResponse.json({ url: publicUrl });
    } else {
      const errorText = await response.text();
      console.error(`[Upload API] Error Bunny CDN (${response.status}): ${errorText}`);
      return NextResponse.json({ error: `Fallo CDN (${response.status}): ${errorText}` }, { status: 500 });
    }
  } catch (err: any) {
    console.error(`[Upload API] Error fatal: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
