import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
import { Client, ApiController, TwoFactorCodeRequestSchema } from '@bandwidth/mfa'
import prompts from 'prompts'

// using .env file to override enviromental variables
const envs = dotenv.parse(fs.readFileSync('.env'))
for (const key in envs) {
    process.env[key] = envs[key]
}

const accountId = process.env.BANDWIDTH_ACCOUNT_ID
const voiceApplicationId = process.env.BANDWIDTH_VOICE_APPLICATION_ID
const messagingApplicationId = process.env.BANDWIDTH_MESSAGING_APPLICATION_ID
const bwPhoneNumber = process.env.BANDWIDTH_PHONE_NUMBER
const username = process.env.BANDWIDTH_USERNAME
const password = process.env.BANDWIDTH_PASSWORD

if (!accountId || !voiceApplicationId || !messagingApplicationId || !bwPhoneNumber ) {
    throw new Error(`Enviroment variables not set up properly
    accountId: ${accountId}
    voiceApplicationId: ${voiceApplicationId}
    messagingApplicationId: ${messagingApplicationId}
    phone number: ${bwPhoneNumber}`)
}

if (!username){
    throw new Error(`Username: undefined`)
}

if (!password){
    throw new Error(`Password: undefined`)
}

console.log(`Enviroment variables set to:
accountId: ${accountId}
messagingApplicationId: ${messagingApplicationId}
voiceApplicationId: ${voiceApplicationId}
phone number: ${bwPhoneNumber}
`)

// initialize the client 
const client = new Client({
    basicAuthPassword: password,
    basicAuthUserName: username
})

// The controller is the main API to the SDK
const controller = new ApiController(client)

const main = async () => {
    const inputs = await prompts([
        {
            name: 'phoneNumber',
            type: 'text',
            message: 'Phone number to send code to (E164 format +13337774444)?'
        },
        {
            name: 'text',
            type: 'multiselect',
            message: 'Text or Voice?',
            max: 1,
            min: 1,
            hint: '- Space to select. Return to submit',
            choices: [
                {title: 'Text', value: true},
                {title: 'Voice', value: false}
            ]
        },
    ])

    let response
    let applicationId
    if (inputs.text[0]) {
        applicationId = messagingApplicationId
        response = await controller.createMessagingTwoFactor(accountId, {
            applicationId,
            digits: 5,
            from: bwPhoneNumber,
            message: 'Hello World, here is your code: {CODE}',
            to: inputs.phoneNumber
        })
    } else {
        applicationId = voiceApplicationId
        response = await controller.createVoiceTwoFactor(accountId, {
            applicationId: voiceApplicationId,
            digits: 5,
            from: bwPhoneNumber,
            message: 'Hello World, here is your code: {CODE}',
            to: inputs.phoneNumber
        })
    }

    if (response.statusCode != 200 ) {
        console.log('Error while creating code.')
        process.exit()
    }

    const code = await prompts({
        name: 'value',
        type: 'text',
        message: 'Please input code?'
    })

    const verify = await controller.createVerifyTwoFactor(accountId, {
        applicationId,
        code: code.value,
        digits: 5,
        expirationTimeInMinutes: 3,
        from: bwPhoneNumber,
        to: inputs.phoneNumber
    })

    if (verify.result.valid) {
        console.log('       Valid Code!')
    } else {
        console.log('       Invalid Code :(')
    }

    const promp = await prompts({
        name: 'restart',
        type: 'multiselect',
        message: 'Restart?',
        max: 1,
        min: 1,
        hint: '- Space to select. Return to submit',
        choices: [
            {title: 'Yes', value: true},
            {title: 'No', value: false}
        ]
    })

    if (promp.restart){
        main()
    }
}
main()