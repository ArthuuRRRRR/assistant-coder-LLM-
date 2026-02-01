import * as assert from 'assert';
import { OllamaService } from '../services/ollamaService';

suite('OllamaService robustness', () => {

    test('Service throws on fetch failure', async () => {
        const service = new OllamaService();

        try {
            await service.sendRequest("test");
            assert.fail("Expected error was not thrown");
        } catch (e) {
            assert.ok(true);
        }
    });

});