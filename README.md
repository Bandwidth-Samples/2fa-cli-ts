# Multi Factor Authentication Sample
<a href="http://dev.bandwidth.com"><img src="https://s3.amazonaws.com/bwdemos/BW-VMP.png"/></a>
</div>

 # Table of Contents

<!-- TOC -->

- [Multi Factor Authentication Sample](#multi-factor-authentication-sample)
- [Description](#description)
- [Bandwidth](#bandwidth)
- [Environmental Variables](#environmental-variables)
- [Callback URLs](#callback-urls)
    - [Ngrok](#ngrok)

<!-- /TOC -->

# Description
This application creates a simple CLI to interact with Bandwidth's MFA API. It allows for the user to receive a code via text or voice, and then verifies the code entered is correct.

# Bandwidth

In order to use the Bandwidth API users need to set up the appropriate application at the [Bandwidth Dashboard](https://dashboard.bandwidth.com/) and create API tokens.

To create an application log into the [Bandwidth Dashboard](https://dashboard.bandwidth.com/) and navigate to the `Applications` tab.  Fill out the **New Application** form selecting the service (Messaging or Voice) that the application will be used for.  All Bandwidth services require publicly accessible Callback URLs, for more information on how to set one up see [Callback URLs](#callback-urls).

For more information about API credentials see [here](https://dev.bandwidth.com/guides/accountCredentials.html#top)

# Environmental Variables
The sample app uses the below environmental variables.
```sh
BW_ACCOUNT_ID                 # Your Bandwidth Account Id
BW_USERNAME                   # Your Bandwidth API Username
BW_PASSWORD                   # Your Bandwidth API Password
BW_NUMBER                     # The Bandwidth phone number involved with this application
BW_VOICE_APPLICATION_ID       # Your Voice Application Id created in the dashboard
BW_MESSAGING_APPLICATION_ID   # Your Messaging Application Id created in the dashboard
```
