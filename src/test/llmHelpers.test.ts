import * as assert from 'assert';
import { parseLLMResponse } from '../commands/llmHelpers';

suite('LLM Helpers', () => {

    test('Parse valid JSON response', () => {
        const raw = `
        {
            "code": "console.log('Hello');",
            "explanation": "Affiche Hello"
        }
        `;
        const result = parseLLMResponse(raw);
        assert.strictEqual(result.code, "console.log('Hello');");
        assert.strictEqual(result.explanation, "Affiche Hello");
    });

    test('Fallback when JSON is invalid', () => {
        const raw = "Texte non JSON";
        const result = parseLLMResponse(raw);
        assert.strictEqual(result.explanation, raw);
    });

});