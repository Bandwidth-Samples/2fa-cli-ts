import { MFAApi, Configuration } from 'bandwidth-sdk'
import prompts from 'prompts';

const BW_ACCOUNT_ID = process.env.BW_ACCOUNT_ID;
const BW_VOICE_APPLICATION_ID = process.env.BW_VOICE_APPLICATION_ID;
const BW_MESSAGING_APPLICATION_ID = process.env.BW_MESSAGING_APPLICATION_ID;
const BW_NUMBER = process.env.BW_NUMBER;
const BW_USERNAME = process.env.BW_USERNAME;
const BW_PASSWORD = process.env.BW_PASSWORD;

if([
    BW_ACCOUNT_ID,
    BW_VOICE_APPLICATION_ID,
    BW_MESSAGING_APPLICATION_ID,
    BW_NUMBER,
    BW_USERNAME,
    BW_PASSWORD
].some(item => item === undefined)) {
    throw new Error('Please set the environment variables defined in the README');
}

const config = new Configuration({
    username: BW_USERNAME,
    password: BW_PASSWORD
});

const mfaApi = new MFAApi(config);

const main = async () => {
    const inputs = await prompts([
        {
            name: 'recipientPhoneNumber',
            type: 'text',
            message: 'Enter phone number in E164 format (+15554443333): '
        },
        {
            name: 'deliveryMethod',
            type: 'text',
            message: 'Enter MFA request method (voice/messaging). Default is messaging: ',
        }
    ]);

    const codeRequestBody = {
        to: inputs.recipientPhoneNumber,
        from: BW_NUMBER,
        applicationId: inputs.deliveryMethod === 'voice' ? BW_VOICE_APPLICATION_ID : BW_MESSAGING_APPLICATION_ID,
        scope: 'scope',
        message: 'Your temporary {NAME} {SCOPE} code is {CODE}',
        digits: 6
    };

    if (inputs.deliveryMethod === 'voice') {
        await mfaApi.generateVoiceCode(BW_ACCOUNT_ID, codeRequestBody);
    } else {
        await mfaApi.generateMessagingCode(BW_ACCOUNT_ID, codeRequestBody);
    }

    const code = await prompts({
        name: 'value',
        type: 'text',
        message: 'Please enter your received code: '
    });

    const verifyRequestBody = {
        to: inputs.recipientPhoneNumber,
        scope: 'scope',
        code: code.value,
        expirationTimeInMinutes: 3
    };

    const { data } = await mfaApi.verifyCode(BW_ACCOUNT_ID, verifyRequestBody);
    data.valid ? console.log('Code verified') : console.log('Code not verified');

}
main();
