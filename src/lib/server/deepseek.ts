import { env } from '$env/dynamic/private';

export async function askDeepSeek(userPrompt: string, systemPrompt: string) {
    const apiKey = env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
        console.error("❌ DEEPSEEK_API_KEY no configurada.");
        throw new Error("El servicio de Inteligencia Artificial no está configurado (falta API Key). Contacte con soporte.");
    }
    
    try {
        console.log('🤖 Sending request to DeepSeek API...');
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ DeepSeek API error (${response.status}):`, errorText);
            throw new Error(`Error de DeepSeek (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        if (!data.choices || data.choices.length === 0) {
            throw new Error('La IA no devolvió ninguna respuesta válida.');
        }
        console.log('✅ DeepSeek response received successfully');
        return data.choices[0].message.content;
    } catch (err: any) {
        console.error('❌ Exception in askDeepSeek:', err);
        throw err;
    }
}
