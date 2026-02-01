import * as assert from 'assert';
import { handleGenerate } from '../commands/generateHandler';

class FakeService {
    async sendRequest(prompt: string) {
        return JSON.stringify({
            code: "// fake code",
            explanation: "fake explanation"
        });
    }
}

suite('Handlers logic', () => {

    test('handleGenerate with instruction only', async () => {
        const service = new FakeService() as any;
        const result = await handleGenerate("Créer une fonction", "", service);

        assert.ok(result.explanation);
        assert.strictEqual(result.code, "// fake code");
    });

});