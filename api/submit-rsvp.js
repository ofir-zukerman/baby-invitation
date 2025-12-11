// Vercel Serverless Function - RSVP Form Handler
// This function securely proxies form submissions to Google Sheets

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get Google Script URL from environment variable
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    if (!googleScriptUrl) {
        console.error('GOOGLE_SCRIPT_URL environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        // Forward the request to Google Apps Script
        const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        // Google Apps Script returns a redirect, follow it
        if (response.redirected) {
            const redirectResponse = await fetch(response.url);
            const data = await redirectResponse.text();

            return res.status(200).json({
                success: true,
                message: 'RSVP submitted successfully'
            });
        }

        // Return success
        return res.status(200).json({
            success: true,
            message: 'RSVP submitted successfully'
        });

    } catch (error) {
        console.error('Error forwarding to Google Script:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to submit RSVP'
        });
    }
}
