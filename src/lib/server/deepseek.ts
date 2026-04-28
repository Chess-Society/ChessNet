import { env } from '$env/dynamic/private';

export async function askDeepSeek(userPrompt: string, systemPrompt: string) {
    const apiKey = env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
        throw new Error('DEEPSEEK_API_KEY is not defined in environment variables');
    }
    
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
            ]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
