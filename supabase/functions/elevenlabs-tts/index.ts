const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ElevenLabs API key not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const { text, voiceId, modelId, stability, similarityBoost, style, useSpeakerBoost } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "A non-empty 'text' field is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;

    const voiceSettings: Record<string, unknown> = {
      stability: typeof stability === "number" ? stability : 0.5,
      similarity_boost: typeof similarityBoost === "number" ? similarityBoost : 0.75,
      style: typeof style === "number" ? style : 0.0,
      use_speaker_boost: typeof useSpeakerBoost === "boolean" ? useSpeakerBoost : true,
    };

    const params = new URLSearchParams();
    params.set("output_format", "mp3_44100_128");

    const response = await fetch(
      `${ELEVENLABS_API_URL}/${selectedVoiceId}?${params.toString()}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: modelId || DEFAULT_MODEL_ID,
          voice_settings: voiceSettings,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorBody: unknown = errorText;
      try {
        errorBody = JSON.parse(errorText);
      } catch {
        // keep raw text
      }
      return new Response(
        JSON.stringify({ error: "ElevenLabs API error", details: errorBody }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=tts-output.mp3",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
