import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { getDb } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            submissionId,
            submissionDate,
            certType,
            reason,
            applicantName,
            applicantEmail,
            applicantPhone,
            relationship,
            subjectName,
            eventDay,
            eventMonth,
            eventYear,
            eventCity,
            eventState,
            fatherName,
            motherName,
            shipStreet,
            shipCity,
            shipState,
            shipZip,
            shipCountry,
            shippingMethod,
            processingSpeed,
            fees
        } = body;

        // Form event date beautifully
        const eventDate = `${eventMonth} ${eventDay}, ${eventYear}`;
        
        // Launch headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // High quality premium invoice template
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Order Receipt - ${submissionId}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    color: #1e293b;
                    background-color: #ffffff;
                    line-height: 1.4;
                    padding: 0;
                }

                .invoice-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 5px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #f1f5f9;
                    padding-bottom: 12px;
                    margin-bottom: 15px;
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logo-text {
                    font-size: 16px;
                    font-weight: 900;
                    letter-spacing: -0.025em;
                    color: #0b2545;
                }

                .logo-tagline {
                    font-size: 9px;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-top: -2px;
                }

                .title-section {
                    text-align: right;
                }

                .title-section h1 {
                    font-size: 18px;
                    font-weight: 800;
                    color: #2563eb;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 3px;
                }

                .meta-badge {
                    display: inline-block;
                    background-color: #ecfdf5;
                    color: #047857;
                    font-size: 8px;
                    font-weight: 800;
                    padding: 2px 6px;
                    border-radius: 9999px;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                }

                .meta-text {
                    font-size: 10px;
                    color: #475569;
                    font-weight: 500;
                }

                .meta-text strong {
                    color: #0f172a;
                }

                /* GRID LAYOUTS */
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                    margin-bottom: 15px;
                }

                .card {
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 12px 15px;
                }

                .card-title {
                    font-size: 9px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #94a3b8;
                    letter-spacing: 0.08em;
                    margin-bottom: 6px;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 4px;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                    font-size: 11px;
                }

                .info-row:last-child {
                    margin-bottom: 0;
                }

                .info-label {
                    color: #64748b;
                    font-weight: 600;
                }

                .info-value {
                    color: #0f172a;
                    font-weight: 700;
                    text-align: right;
                }

                /* FULL WIDTH DETAILS CARD */
                .section-title {
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: #0b2545;
                    letter-spacing: 0.05em;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .section-title::after {
                    content: '';
                    flex-grow: 1;
                    height: 1px;
                    background-color: #e2e8f0;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 12px 15px;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                }

                .detail-label {
                    font-size: 8px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #94a3b8;
                    letter-spacing: 0.05em;
                    margin-bottom: 2px;
                }

                .detail-value {
                    font-size: 11px;
                    font-weight: 700;
                    color: #0f172a;
                }

                /* COST TABLE */
                .cost-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 15px;
                }

                .cost-table th {
                    text-align: left;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #64748b;
                    font-weight: 700;
                    padding: 6px 12px;
                    border-bottom: 2px solid #e2e8f0;
                    background-color: #f8fafc;
                }

                .cost-table td {
                    padding: 8px 12px;
                    font-size: 11px;
                    color: #334155;
                    border-bottom: 1px solid #f1f5f9;
                }

                .cost-table tr:last-of-type td {
                    border-bottom: none;
                }

                .cost-table .text-right {
                    text-align: right;
                }

                .cost-table .font-bold {
                    font-weight: 700;
                    color: #0f172a;
                }

                .total-box-container {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 5px;
                }

                .total-box {
                    background-color: #eff6ff;
                    border: 1px solid #bfdbfe;
                    border-radius: 10px;
                    padding: 8px 16px;
                    width: 250px;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .total-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: #1e3a8a;
                    text-transform: uppercase;
                }

                .total-price {
                    font-size: 16px;
                    font-weight: 900;
                    color: #2563eb;
                }

                /* FOOTER */
                .footer {
                    margin-top: 15px;
                    border-top: 1px solid #f1f5f9;
                    padding-top: 10px;
                    text-align: center;
                    font-size: 9px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .footer-email {
                    color: #2563eb;
                    font-weight: 600;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                
                <!-- HEADER -->
                <div class="header">
                    <div class="logo-section">
                        <div style="background-color: #2563eb; width: 12px; height: 28px; border-radius: 3px;"></div>
                        <div>
                            <div class="logo-text">ORDER VITAL RECORDS</div>
                            <div class="logo-tagline">Secure Document Prep Service</div>
                        </div>
                    </div>
                    
                    <div class="title-section">
                        <h1>Order Receipt</h1>
                        <div class="meta-badge">Successful Payment</div>
                        <div class="meta-text">ID: <strong>${submissionId}</strong></div>
                        <div class="meta-text">Date: <strong>${submissionDate}</strong></div>
                    </div>
                </div>

                <!-- INFO GRID -->
                <div class="grid-2">
                    <!-- APPLICANT INFO -->
                    <div class="card">
                        <div class="card-title">Applicant Contact Information</div>
                        <div class="info-row">
                            <span class="info-label">Full Name:</span>
                            <span class="info-value">${applicantName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email Address:</span>
                            <span class="info-value">${applicantEmail}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Mobile Phone:</span>
                            <span class="info-value">${applicantPhone}</span>
                        </div>
                    </div>

                    <!-- SHIPPING DETAILS -->
                    <div class="card">
                        <div class="card-title">Shipping & Delivery Details</div>
                        <div class="info-row">
                            <span class="info-label">Street Address:</span>
                            <span class="info-value">${shipStreet}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">City, State & Zip:</span>
                            <span class="info-value">${shipCity}, ${shipState} ${shipZip}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Country:</span>
                            <span class="info-value">${shipCountry}</span>
                        </div>
                    </div>
                </div>

                <!-- RECORD OBJECT DETAILS -->
                <div class="section-title">Certificate Subject & Event Details</div>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Certificate Type</span>
                        <span class="detail-value" style="color: #2563eb;">${certType} Certificate</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Relationship</span>
                        <span class="detail-value">${relationship}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Reason for Request</span>
                        <span class="detail-value">${reason}</span>
                    </div>

                    <div class="detail-item">
                        <span class="detail-label">Subject's Full Name</span>
                        <span class="detail-value">${subjectName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Event City / County</span>
                        <span class="detail-value">${eventCity}, ${eventState}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date of Event</span>
                        <span class="detail-value">${eventDate}</span>
                    </div>

                    <div class="detail-item" style="grid-column: span 1.5;">
                        <span class="detail-label">Father's Full Name</span>
                        <span class="detail-value">${fatherName || 'N/A'}</span>
                    </div>
                    <div class="detail-item" style="grid-column: span 1.5;">
                        <span class="detail-label">Mother's Maiden Name</span>
                        <span class="detail-value">${motherName || 'N/A'}</span>
                    </div>
                </div>

                <!-- COST BREAKDOWN -->
                <div class="section-title">Order Cost Breakdown</div>
                <table class="cost-table">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Quantity</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="font-bold">${certType} Certificate Fee (${eventState})</td>
                            <td>1</td>
                            <td class="text-right">$${fees.stateFee.toFixed(2)}</td>
                            <td class="text-right font-bold">$${fees.stateFee.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Platform Document Preparation & Management Fee</td>
                            <td>1</td>
                            <td class="text-right">$${fees.platformFee.toFixed(2)}</td>
                            <td class="text-right font-bold">$${fees.platformFee.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Shipping Delivery fee (${shippingMethod === 'express' ? 'Express / Overnight' : 'Standard Delivery'})</td>
                            <td>1</td>
                            <td class="text-right">$${fees.shippingCost.toFixed(2)}</td>
                            <td class="text-right font-bold">$${fees.shippingCost.toFixed(2)}</td>
                        </tr>
                        ${fees.processingCost > 0 ? `
                        <tr>
                            <td>Expedited Fast-Track Processing Speed Add-on</td>
                            <td>1</td>
                            <td class="text-right">$${fees.processingCost.toFixed(2)}</td>
                            <td class="text-right font-bold">$${fees.processingCost.toFixed(2)}</td>
                        </tr>
                        ` : ''}
                    </tbody>
                </table>

                <!-- TOTAL BOX -->
                <div class="total-box-container">
                    <div class="total-box">
                        <div class="total-row">
                            <span class="total-label">Total Amount Paid</span>
                            <span class="total-price">$${fees.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <!-- FOOTER -->
                <div class="footer">
                    <p style="margin-bottom: 5px;">Order Vital Records is a private document preparation service and is not affiliated with any U.S. government agency.</p>
                    <p>For support or status inquiries, please contact us at <a class="footer-email" href="mailto:support@ordervitalrecords.com">support@ordervitalrecords.com</a></p>
                    <p style="margin-top: 15px; font-size: 8px;">Submission ID: ${submissionId} | Transaction Securely Processed via Mock Gateway.</p>
                </div>

            </div>
        </body>
        </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'load' as any });

        // Generate high quality PDF page
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // 1. Save generated PDF to the filesystem inside public/submissions/
        let pdfRelativePath = "";
        try {
            const submissionsDir = path.resolve(process.cwd(), 'public', 'submissions');
            await fs.mkdir(submissionsDir, { recursive: true });
            const pdfFileName = `Receipt-${submissionId}.pdf`;
            const pdfFilePath = path.join(submissionsDir, pdfFileName);
            await fs.writeFile(pdfFilePath, pdfBuffer);
            pdfRelativePath = `/submissions/${pdfFileName}`;
        } catch (fsError) {
            console.error("Failed to save PDF to filesystem:", fsError);
        }

        // 2. Save complete submission details to the SQLite database
        try {
            const db = await getDb();

            const userInfo = JSON.stringify({
                applicantName,
                applicantEmail,
                applicantPhone,
                relationship,
                subjectName,
                fatherName,
                motherName
            });

            const shippingDetails = JSON.stringify({
                shipStreet,
                shipCity,
                shipState,
                shipZip,
                shipCountry,
                shippingMethod,
                processingSpeed
            });

            const additionalDetails = JSON.stringify({
                reason,
                eventDay,
                eventMonth,
                eventYear,
                eventCity,
                eventState,
                fees
            });

            await db.run(
                `INSERT OR REPLACE INTO submissions (id, user_info, certificate_type, shipping_details, additional_details, pdf_path)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [submissionId, userInfo, certType, shippingDetails, additionalDetails, pdfRelativePath]
            );
        } catch (dbError) {
            // Log database error but do not block the user response, ensuring high resilience
            console.error("Database save error:", dbError);
        }

        return new NextResponse(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Receipt-${submissionId}.pdf"`,
                'Content-Length': pdfBuffer.length.toString()
            }
        });

    } catch (error: any) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate professional PDF", details: error.message },
            { status: 500 }
        );
    }
}
