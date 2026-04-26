import { env } from '$env/dynamic/private';

export async function askDeepSeek(systemPrompt: string, userPrompt: string) {
    const apiKey = env.DEEPSEEK_API_KEY || 'sk-132b04dec23d432c90d5724b2a8d61a6';
    
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
            response_format: {
                type: 'json_object'
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
