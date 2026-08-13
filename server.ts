import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI Server Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Route & Activity Prediction Endpoint
app.post('/api/ai/predict-activity', async (req, res) => {
  try {
    const { personName, location, activity, historicalPoints } = req.body;

    const prompt = `You are an AI Security Trajectory & Gait Analytics System.
Analyze this person's tracking data and output a realistic JSON prediction object:
- Person Name: ${personName || 'Subject'}
- Current Location: ${location?.address || 'Unknown Address'}, ${location?.city || ''}
- Speed: ${activity?.speedMph || 0} mph (${activity?.category || 'unknown'})
- Heading: ${activity?.headingDegrees || 0}° ${activity?.headingCardinal || 'N'}
- Recent Path: ${JSON.stringify(historicalPoints || [])}

Respond strictly with valid JSON without markdown formatting, following this structure:
{
  "currentAction": "Detailed description of what the person is doing right now",
  "predictedDestination": "Specific landmark/place name where they are heading",
  "destinationAddress": "Full street address of predicted destination",
  "estimatedArrivalMinutes": 12,
  "aiConfidenceScore": 94,
  "trajectoryStatus": "On Timed Schedule",
  "behavioralRiskNote": "Normal routine movement pattern detected with low risk."
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({ success: true, data: parsed });
    } else {
      // Fallback fallback simulated response if GEMINI_API_KEY is not set
      return res.json({
        success: true,
        data: {
          currentAction: `Walking briskly along ${location?.address || 'the street'} at ${activity?.speedMph || 3.2} mph.`,
          predictedDestination: `Union Square Transit Hub (${location?.city || 'San Francisco'})`,
          destinationAddress: `333 Post St, ${location?.city || 'San Francisco'}`,
          estimatedArrivalMinutes: 8,
          aiConfidenceScore: 92,
          trajectoryStatus: 'On Timed Schedule',
          behavioralRiskNote: 'Consistent gait and steady velocity. No anomalous distress patterns detected.',
        },
      });
    }
  } catch (err: any) {
    console.error('Error in predict-activity:', err);
    return res.status(500).json({ error: err.message || 'AI prediction failed' });
  }
});

// AI Crime Scene & Panic Incident Analyzer Endpoint
app.post('/api/ai/crime-analysis', async (req, res) => {
  try {
    const { deviceName, personName, crimeType, severityLevel, location, panicState } = req.body;

    const prompt = `You are a Law Enforcement Forensic AI Dispatcher & Crime Scene Analyst.
Analyze this active Emergency Alarm & Crime Scene report:
- Subject/Target: ${personName || deviceName || 'Unknown'}
- Reported Crime/Incident: ${crimeType || 'Emergency SOS Alarm'}
- Severity Level: ${severityLevel || 'Level 4 (Critical)'}
- Crime Coordinates: Lat ${location?.lat}, Lng ${location?.lng} (${location?.address || ''})
- Audio Wiretap Status: ${panicState?.audioWiretapActive ? 'ACTIVE (Acoustic audio telemetry streaming)' : 'Inactive'}
- Ambient Noise Level: ${panicState?.decibelLevel || 85} dB

Return a structured JSON briefing object strictly formatted as JSON without markdown:
{
  "incidentId": "CS-911-8842",
  "forensicSummary": "Concise high-level incident summary suitable for police first responders.",
  "threatRatingScore": 92,
  "crimeScenePerimeterMeters": 150,
  "tacticalDirectives": [
    "Dispatch 2 Armed Patrol Units to primary crime scene coordinates.",
    "Activate automatic traffic camera feed within 200m perimeter.",
    "Alert nearest Trauma Hospital Emergency Room for medical triage."
  ],
  "evidenceLogs": [
    "Acoustic impact shockwave recorded at 94dB.",
    "Rapid cell tower handoff detected indicating fleeing subject or vehicle.",
    "Encrypted cloud audio wiretap snippet attached to police case file."
  ]
}`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return res.json({ success: true, data: parsed });
    } else {
      return res.json({
        success: true,
        data: {
          incidentId: `CS-911-${Math.floor(1000 + Math.random() * 9000)}`,
          forensicSummary: `ACTIVE CRIME SCENE ALERT: ${crimeType || 'Violent Threat'} detected at ${location?.address || 'coordinates'}. Acoustic impact telemetry indicates distress situation.`,
          threatRatingScore: 94,
          crimeScenePerimeterMeters: 200,
          tacticalDirectives: [
            `Dispatch units to ${location?.address || 'location'} immediately.`,
            'Establish 200-meter containment zone & check localized CCTV streams.',
            'Notify nearest Emergency Trauma Center for medical readiness.',
          ],
          evidenceLogs: [
            'Acoustic shock sensor registered 92dB acoustic burst.',
            'GPS coordinates verified via 3 independent cell towers.',
            'Biometric telemetry logged elevated heart rate (132 BPM).',
          ],
        },
      });
    }
  } catch (err: any) {
    console.error('Error in crime-analysis:', err);
    return res.status(500).json({ error: err.message || 'Crime analysis failed' });
  }
});

// AI Security Advisor Interactive Chat
app.post('/api/ai/security-chat', async (req, res) => {
  try {
    const { userMessage, deviceContext } = req.body;

    const systemPrompt = `You are SecureLocator's AI Tactical Security & Personal Safety Advisor.
You have access to live target telemetry:
Target: ${deviceContext?.personName || deviceContext?.name || 'User'}
Location: ${deviceContext?.location?.address}, ${deviceContext?.location?.city}
Country: ${deviceContext?.country || 'USA'}
Activity: ${deviceContext?.currentActivity?.action || 'Stationary'} (${deviceContext?.currentActivity?.speedMph || 0} mph)
Alarm Status: ${deviceContext?.panicAlarmState?.isAlarmActive ? 'EMERGENCY SOS ACTIVE' : 'Normal'}

Provide concise, practical, tactical, and helpful advice. Keep responses under 4 sentences.`;

    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${systemPrompt}\n\nUser Question: ${userMessage}`,
      });

      return res.json({ success: true, text: response.text });
    } else {
      return res.json({
        success: true,
        text: `SecureLocator AI Security Advisor: Target is currently located near ${deviceContext?.location?.address || 'San Francisco'}. Security status is monitored in real-time with end-to-end encryption. All emergency dispatch channels are standing by.`,
      });
    }
  } catch (err: any) {
    console.error('Error in security-chat:', err);
    return res.status(500).json({ error: err.message || 'Chat failed' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
