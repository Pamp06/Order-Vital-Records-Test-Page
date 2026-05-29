import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const certType = searchParams.get('certType') || '';

        const db = await getDb();
        let query = 'SELECT * FROM submissions';
        const params: any[] = [];
        const conditions: string[] = [];

        if (certType && certType !== 'All') {
            conditions.push('certificate_type = ?');
            params.push(certType);
        }

        if (q) {
            conditions.push('(id LIKE ? OR user_info LIKE ? OR shipping_details LIKE ?)');
            const wild = `%${q}%`;
            params.push(wild, wild, wild);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const rows = await db.all(query, params);

        // Parse JSON columns back into JS objects for the frontend
        const submissions = rows.map((row: any) => ({
            id: row.id,
            userInfo: JSON.parse(row.user_info || '{}'),
            certType: row.certificate_type,
            shippingDetails: JSON.parse(row.shipping_details || '{}'),
            additionalDetails: JSON.parse(row.additional_details || '{}'),
            pdfPath: row.pdf_path,
            createdAt: row.created_at
        }));

        return NextResponse.json({ submissions });
    } catch (error: any) {
        console.error("Fetch submissions error:", error);
        return NextResponse.json(
            { error: "Failed to fetch submissions", details: error.message },
            { status: 500 }
        );
    }
}
