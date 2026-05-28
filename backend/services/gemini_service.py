import os
import base64
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

def analyze_medicine_image(base64_image_data, mime_type="image/jpeg"):
    """
    Decodes the Base64 image and sends it to the Gemini 1.5 Flash API for returns & damage analysis.
    If no GEMINI_API_KEY is defined, returns a mock analysis report for development convenience.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Check if header exists in base64 data and strip it
    if "," in base64_image_data:
        header, base64_image_data = base64_image_data.split(",", 1)
        if "mime" in header:
            # Extract mime type: e.g. "data:image/png;base64" -> "image/png"
            parts = header.split(";")
            if len(parts) > 0:
                mime_type = parts[0].replace("data:", "")

    if not api_key:
        logger.warning("GEMINI_API_KEY not configured. Using mock fallback analysis.")
        return get_mock_analysis_response()

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3.5-flash')
        
        image_bytes = base64.b64decode(base64_image_data)
        
        prompt = (
            "Analyze this medicine image for an inventory return and damaged stock request. "
            "Examine it thoroughly and provide a structured professional analysis under the following headings:\n\n"
            "1. DAMAGE VISIBILITY: Describe any visible physical damage to the pills, capsules, bottles, or strips.\n"
            "2. PACKAGING CONDITION: Identify if the packaging (carton box, blister pack, vial, etc.) is torn, crushed, punctured, or wet.\n"
            "3. EXPIRY VISIBILITY: Report whether the batch number or expiration date is visible and legible, and transcribe it if possible.\n"
            "4. LABEL READABILITY: Determine if the product name, dosage, and manufacturer label details are readable.\n"
            "5. MOISTURE/LEAKAGE SIGNS: Check for signs of liquid leakage, color deterioration, moisture damage, or mold.\n\n"
            "Provide a concise, professional assessment suitable for a pharmaceutical distributor dashboard. "
            "IMPORTANT: Do not use any markdown formatting, asterisks (*), or hashtags (#) in your response. Output plain text only."
        )
        
        response = model.generate_content([
            {
                'mime_type': mime_type,
                'data': image_bytes
            },
            prompt
        ], request_options={"timeout": 600})
        
        # Clean up any residual markdown symbols just in case
        clean_text = response.text.replace('*', '').replace('#', '')
        return clean_text
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        # Return fallback mock with warning
        return f"[Gemini API Call Failed: {str(e)}]\n\n" + get_mock_analysis_response()

def get_mock_analysis_response():
    return (
        "*** [MOCK AI ANALYSIS REPORT - NO API KEY PROVIDED] ***\n\n"
        "1. DAMAGE VISIBILITY: Minor physical wear visible. No visible breakage of pills or capsule rupture detected.\n"
        "2. PACKAGING CONDITION: Outer box displays crushing at the corners. Outer foil seal appears partially broken or folded.\n"
        "3. EXPIRY VISIBILITY: Expiry date label is present near the barcode but partially blurred. Legible digits suggest 'EXP: 11/2026'.\n"
        "4. LABEL READABILITY: High readability. Product name, dosage (500mg), and warning labels are 90% legible.\n"
        "5. MOISTURE/LEAKAGE SIGNS: No signs of active leakage, mold growth, or moisture discoloration detected on the primary packaging."
    )
