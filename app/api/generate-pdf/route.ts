import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { getDb } from '../../../lib/db';
import { getSessionUser } from '../../../lib/auth';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Exclude credit card details explicitly (never save or process them beyond payment gateway)
        const {
            submissionId,
            submissionDate, // The 'Date' at the top
            
            number_of_copies,
            paternity_copies,
            
            first_name,
            middle_name,
            last_name,
            
            name_changed,
            original_name,
            
            dob_month,
            dob_day,
            dob_year,
            sex,
            
            birth_city,
            birth_county,
            birth_state,
            birth_country,
            
            hospital,
            father_name,
            mother_maiden_name,
            mother_last_name_at_birth,
            older_sibling,
            younger_sibling,
            
            signature, // The form asks for signature
            relationship,
            purpose,
            
            phone,
            email,
            
            mail_name,
            mail_address,
            mail_city_state,
            mail_zip
        } = body;

        // Launch headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Exact reproduction of the TN Application Form
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>TN Certificate Application</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;700&display=swap');
                
                * { box-sizing: border-box; margin: 0; padding: 0; }

                body {
                    font-family: Arial, sans-serif;
                    color: #000;
                    background-color: #fff;
                    width: 8.5in;
                    height: 11in;
                    margin: 0 auto;
                    padding: 0.3in 0.4in;
                    line-height: 1.15;
                    box-sizing: border-box;
                }

                .header {
                    text-align: center;
                    margin-bottom: 25px;
                }

                .header h1 {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 2px;
                }
                .header h2 {
                    font-size: 13px;
                    font-weight: normal;
                    margin-bottom: 15px;
                }
                .header h3 {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 2px;
                }
                .header h4 {
                    font-size: 11px;
                    font-weight: normal;
                }



                .row {
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 15px;
                    width: 100%;
                }

                .row-label {
                    font-size: 12px;
                    font-weight: bold;
                    white-space: nowrap;
                    padding-right: 5px;
                }

                .underline-field {
                    border-bottom: 1px solid #000;
                    flex-grow: 1;
                    font-family: monospace;
                    font-size: 13px;
                    padding-left: 5px;
                    padding-bottom: 1px;
                    line-height: 1;
                }

                .flex-col {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                }
                
                .sub-label {
                    font-size: 10px;
                    font-weight: normal;
                    position: absolute;
                    top: 100%;
                    white-space: nowrap;
                    margin-top: 2px;
                }

                .checkbox-container {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-left: 10px;
                }
                .checkbox {
                    width: 12px; height: 12px;
                    border: 1px solid #000;
                    display: inline-block;
                    text-align: center;
                    line-height: 12px;
                    font-size: 10px;
                }

                .info-box {
                    margin-top: 15px;
                    font-size: 10px;
                    text-align: justify;
                }
                
                .info-box strong { font-weight: bold; }
                
                .dashed-line {
                    border-top: 1px dashed #000;
                    margin: 10px 0;
                }

                .footer-box {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }

                .address-block {
                    width: 60%;
                }

                .mail-to-block {
                    width: 35%;
                    text-align: center;
                    font-size: 12px;
                    font-weight: bold;
                }

            </style>
        </head>
        <body>
            <div class="header">
                <h1>TENNESSEE DEPARTMENT OF HEALTH</h1>
                <h2>OFFICE OF VITAL RECORDS</h2>
                <h3>APPLICATION FOR CERTIFIED COPY OF A TENNESSEE CERTIFICATE OF LIVE BIRTH</h3>
                <h4>(La versión en español al reverso de la página)</h4>
            </div>

            <!-- Top Section -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div style="width: 45%; padding-top: 15px;">
                    <div class="row">
                        <span class="row-label">Date:</span>
                        <div class="underline-field">${submissionDate}</div>
                    </div>
                </div>
                <div style="width: 50%; text-align: right; font-size: 11px; font-weight: bold; line-height: 1.4;">
                    <div>
                        Number of Copies <span style="border-bottom:1px solid #000; padding:0 15px;">${number_of_copies}</span>
                    </div>
                    <div>Enclose $15.00 for each copy</div>
                    <div style="margin-top: 3px;">
                        <span style="border-bottom:1px solid #000; padding:0 10px;">${paternity_copies > 0 ? paternity_copies : ''}</span> Copy of Voluntary Acknowledgment of Paternity - $5.00 each copy
                    </div>
                    <div style="font-size: 9px; font-weight: normal;">(When purchased with a certified copy of the birth certificate.)</div>
                </div>
            </div>

            <!-- Form Fields -->
            <div class="row">
                <span class="row-label">Full name on birth certificate:</span>
                <div class="flex-col" style="flex-grow: 1;">
                    <div class="underline-field" style="width: 100%;">${first_name}</div>
                    <span class="sub-label">First</span>
                </div>
                <div class="flex-col" style="flex-grow: 1; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%;">${middle_name}</div>
                    <span class="sub-label">Middle</span>
                </div>
                <div class="flex-col" style="flex-grow: 1; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%;">${last_name}</div>
                    <span class="sub-label">Last Name</span>
                </div>
            </div>

            <div class="row">
                <span class="row-label">Has the name ever been changed other than by marriage?</span>
                <div class="checkbox-container">
                    <div class="checkbox">${name_changed ? 'X' : ''}</div> Yes
                    <div class="checkbox">${!name_changed ? 'X' : ''}</div> No
                </div>
            </div>

            <div class="row">
                <span class="row-label">If yes, what was original name?</span>
                <div class="underline-field">${original_name || ''}</div>
            </div>

            <div class="row">
                <span class="row-label">Date of birth:</span>
                <div class="flex-col" style="width: 15%;">
                    <div class="underline-field" style="width: 100%; text-align: center;">${dob_month}</div>
                    <span class="sub-label">Month</span>
                </div>
                <div class="flex-col" style="width: 15%; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%; text-align: center;">${dob_day}</div>
                    <span class="sub-label">Day</span>
                </div>
                <div class="flex-col" style="width: 20%; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%; text-align: center;">${dob_year}</div>
                    <span class="sub-label">Year</span>
                </div>
                <span class="row-label" style="margin-left: 30px;">Sex:</span>
                <div class="underline-field">${sex}</div>
            </div>

            <div class="row">
                <span class="row-label">Place of birth:</span>
                <div class="flex-col" style="width: 25%;">
                    <div class="underline-field" style="width: 100%;">${birth_city}</div>
                    <span class="sub-label">City</span>
                </div>
                <div class="flex-col" style="width: 20%; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%;">${birth_county}</div>
                    <span class="sub-label">County</span>
                </div>
                <div class="flex-col" style="width: 15%; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%;">${birth_state}</div>
                    <span class="sub-label">State</span>
                </div>
                <div class="flex-col" style="flex-grow: 1; margin-left: 10px;">
                    <div class="underline-field" style="width: 100%;">${birth_country !== 'USA' && birth_country !== 'United States' ? birth_country : ''}</div>
                    <span class="sub-label">Foreign Country (if Report of Foreign Birth)</span>
                </div>
            </div>

            <div class="row">
                <span class="row-label">Hospital where birth occurred:</span>
                <div class="underline-field">${hospital}</div>
            </div>

            <div class="row">
                <span class="row-label">Full name of father:</span>
                <div class="underline-field">${father_name}</div>
            </div>

            <div class="row">
                <span class="row-label">Full maiden name of mother:</span>
                <div class="underline-field">${mother_maiden_name}</div>
            </div>

            <div class="row">
                <span class="row-label">Last name of mother at time of birth:</span>
                <div class="underline-field">${mother_last_name_at_birth}</div>
            </div>

            <div class="row">
                <span class="row-label">Next older brother or sister:</span>
                <div class="underline-field" style="flex-grow: 0; width: 35%;">${older_sibling}</div>
                <span class="row-label" style="margin-left: 15px;">Younger:</span>
                <div class="underline-field">${younger_sibling}</div>
            </div>

            <div class="row">
                <span class="row-label">Signature of person making request:</span>
                <div class="underline-field" style="font-family: 'Brush Script MT', cursive; font-size: 18px;">${mail_name}</div>
            </div>

            <div class="row">
                <span class="row-label">Relationship:</span>
                <div class="underline-field">${relationship}</div>
            </div>

            <div class="row">
                <span class="row-label">Purpose of copy:</span>
                <div class="underline-field">${purpose}</div>
            </div>

            <div class="row">
                <span class="row-label" style="display:block; width:100%;">Telephone number and email where you may be reached for additional information:</span>
            </div>
            <div class="row">
                <div class="underline-field" style="width: 35%; flex-grow: 0;">${phone}</div>
                <div class="underline-field" style="flex-grow: 1; margin-left: 20px;">${email}</div>
            </div>

            <div style="text-align: center; margin-top: 15px; font-weight: bold; font-size: 12px;">
                IT IS UNLAWFUL TO WILLFULLY AND KNOWINGLY MAKE ANY FALSE STATEMENT ON THIS APPLICATION.
            </div>
            <div style="text-align: left; margin-top: 10px; font-weight: bold; font-size: 11px; text-decoration: underline;">
                Records are filed in this office for the past 100 years: and over 100 years are available at the TN State Library and Archives.
            </div>

            <div class="info-box">
                A fee of $15.00 is charged for the search of the records and includes one copy of the record if located. Search fees are non-refundable if the record is not on file. All items must be completed and appropriate fees attached to process this request. Do not send cash. Send check or money order payable to: Tennessee Vital Records. <strong><u>In addition, unless this application is notarized, you must send a photocopy of a VALID government issued ID showing your signature.</u></strong> If you have not received a response within 45 days, please write or call Tennessee Vital Records at (615) 741-1763.
            </div>

            <div class="dashed-line"></div>
            
            <div style="text-align: center; font-size: 12px;">
                PRINT NAME AND ADDRESS BELOW FOR OUR RECORDS<br>
                <strong style="font-size: 15px;">Please remember to include the Fee and a Copy of your ID.</strong>
                <span style="font-style: italic; font-size: 10px;">(Note: The request will be returned if not included.)</span>
            </div>

            <div class="footer-box">
                <div class="address-block">
                    <div class="row" style="margin-bottom: 22px;">
                        <div class="flex-col" style="width: 100%;">
                            <div class="underline-field" style="width: 100%; border-bottom-width: 2px;">${mail_name}</div>
                            <span class="sub-label" style="align-self: flex-start; font-weight:bold;">Name</span>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 22px;">
                        <div class="flex-col" style="width: 100%;">
                            <div class="underline-field" style="width: 100%; border-bottom-width: 2px;">${mail_address}</div>
                            <span class="sub-label" style="align-self: flex-start; font-weight:bold;">Address or Route</span>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 22px;">
                        <div class="flex-col" style="width: 65%;">
                            <div class="underline-field" style="width: 100%; border-bottom-width: 2px;">${mail_city_state}</div>
                            <span class="sub-label" style="align-self: flex-start; font-weight:bold;">City and State</span>
                        </div>
                        <div class="flex-col" style="width: 30%; margin-left: 5%;">
                            <div class="underline-field" style="width: 100%; border-bottom-width: 2px;">${mail_zip}</div>
                            <span class="sub-label" style="align-self: flex-start; font-weight:bold;">Zip Code</span>
                        </div>
                    </div>
                </div>

                <div class="mail-to-block">
                    <u>Mail Your Application To:</u><br><br>
                    Tennessee Vital Records<br>
                    Andrew Johnson Tower, 1<sup>st</sup> Floor<br>
                    710 James Robertson Parkway<br>
                    Nashville, TN 37243
                </div>
            </div>

        </body>
        </html>
        `;

        await page.setContent(htmlContent, { waitUntil: 'load' as any });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
        });

        await browser.close();

        // 1. Save generated PDF to filesystem
        let pdfRelativePath = "";
        try {
            const submissionsDir = path.resolve(process.cwd(), 'public', 'submissions');
            await fs.mkdir(submissionsDir, { recursive: true });
            const pdfFileName = `Application-${submissionId}.pdf`;
            const pdfFilePath = path.join(submissionsDir, pdfFileName);
            await fs.writeFile(pdfFilePath, pdfBuffer);
            pdfRelativePath = `/submissions/${pdfFileName}`;
        } catch (fsError) {
            console.error("Failed to save PDF to filesystem:", fsError);
        }

        // 2. Save details to new SQLite Database structure
        const db = await getDb();
        try {
            const user = await getSessionUser();
            const userId = user ? user.id : null;

            await db.run(
                `INSERT INTO tn_birth_applications (
                    id, user_id, date, number_of_copies, paternity_copies, first_name, middle_name, last_name, 
                    name_changed, original_name, dob_month, dob_day, dob_year, sex, birth_city, birth_county, 
                    birth_state, birth_country, hospital, father_name, mother_maiden_name, mother_last_name_at_birth, 
                    older_sibling, younger_sibling, signature, relationship, purpose, phone, email, mail_name, 
                    mail_address, mail_city_state, mail_zip, pdf_path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    submissionId, userId, submissionDate, number_of_copies, paternity_copies, first_name, middle_name, last_name,
                    name_changed ? 1 : 0, original_name, dob_month, dob_day, dob_year, sex, birth_city, birth_county,
                    birth_state, birth_country, hospital, father_name, mother_maiden_name, mother_last_name_at_birth,
                    older_sibling, younger_sibling, mail_name, relationship, purpose, phone, email, mail_name,
                    mail_address, mail_city_state, mail_zip, pdfRelativePath
                ]
            );

        } catch (dbError) {
            console.error("Database save error:", dbError);
        }

        // Send Email via Resend
        if (resend) {
            try {
                await resend.emails.send({
                    from: 'Tennessee Vital Records <onboarding@resend.dev>',
                    to: email,
                    subject: `Your Vital Records Application - ${submissionId}`,
                    text: `Hello,\n\nAttached is your official Tennessee Vital Records application (${submissionId}).\n\nPlease print it, sign it, and mail it along with the required fee and ID as instructed on the form.\n\nThank you.`,
                    attachments: [
                        {
                            filename: `Application-${submissionId}.pdf`,
                            content: Buffer.from(pdfBuffer),
                        }
                    ]
                });
                console.log(`Email sent successfully to ${email}`);
            } catch (emailError) {
                console.error("Failed to send email via Resend:", emailError);
            }
        } else {
            console.warn("RESEND_API_KEY is not set. Email was not sent.");
        }

        return new NextResponse(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="Application-' + submissionId + '.pdf"',
                'Content-Length': pdfBuffer.length.toString()
            }
        });

    } catch (error: any) {
        console.error("PDF generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF", details: error.message },
            { status: 500 }
        );
    }
}
