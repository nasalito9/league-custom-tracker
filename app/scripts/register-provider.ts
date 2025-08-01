#!/usr/bin/env tsx
// Script to register your application as a tournament provider with Riot Games
// Usage: npx tsx app/scripts/register-provider.ts

import { getCallbackUrl, RIOT_API_CONFIG, validateRiotApiConfig } from '../utils/riot-api-config';

async function registerProvider() {
  // Validate configuration
  const validation = validateRiotApiConfig();
  if (!validation.isValid) {
    console.error('❌ Configuration errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
  }

  const apiKey = process.env.RIOT_API_KEY;
  if (!apiKey) {
    console.error('❌ RIOT_API_KEY environment variable is required');
    process.exit(1);
  }

  // Configure the registration
  const region = 'AMERICAS'; // Change to your preferred region
  const callbackUrl = getCallbackUrl();
  
  console.log('🚀 Registering Tournament Provider...');
  console.log(`📍 Region: ${region}`);
  console.log(`🔗 Callback URL: ${callbackUrl}`);
  
  try {
    // Step 1: Register Provider Data
    const baseUrl = RIOT_API_CONFIG.REGIONS[region];
    const endpoint = `${baseUrl}${RIOT_API_CONFIG.TOURNAMENT_ENDPOINTS.REGISTER_PROVIDER}`;
    
    const providerPayload = {
      region: region,
      url: callbackUrl
    };

    console.log('\n📤 Sending provider registration request...');
    console.log('Payload:', JSON.stringify(providerPayload, null, 2));

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Riot-Token': apiKey
      },
      body: JSON.stringify(providerPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const providerId = await response.json();
    
    console.log('\n✅ Provider registration successful!');
    console.log(`🆔 Provider ID: ${providerId}`);
    console.log('\n📋 Next steps:');
    console.log('1. Save your Provider ID for tournament registration');
    console.log('2. Test your callback endpoint');
    console.log('3. Register tournaments using this Provider ID');
    
    // Test callback URL accessibility
    console.log('\n🔍 Testing callback URL accessibility...');
    try {
      const statusResponse = await fetch(`${callbackUrl.replace('/callback', '/status')}`);
      if (statusResponse.ok) {
        console.log('✅ Callback endpoint is accessible');
      } else {
        console.log('⚠️  Callback endpoint returned non-200 status');
      }
    } catch (error) {
      console.log('❌ Callback endpoint is not accessible from this environment');
      console.log('   Make sure your application is deployed and publicly accessible');
    }

    return {
      providerId,
      callbackUrl,
      region
    };

  } catch (error) {
    console.error('\n❌ Provider registration failed:');
    console.error(error instanceof Error ? error.message : error);
    
    // Common error troubleshooting
    console.log('\n💡 Troubleshooting tips:');
    console.log('- Verify your RIOT_API_KEY is valid and has tournament access');
    console.log('- Ensure your callback URL is publicly accessible');
    console.log('- Check that you have the correct API permissions');
    console.log('- Verify the region parameter matches your intended region');
    
    process.exit(1);
  }
}

// Run the registration if this script is executed directly
if (require.main === module) {
  registerProvider().catch(console.error);
}

export { registerProvider }; 