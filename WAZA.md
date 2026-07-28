Make sure to change the `model` value in: `.waza.yaml` as well.

GPT 5.4
```
COPILOT_PROVIDER_BASE_URL="https://litellm-ai.accelint.dev" COPILOT_PROVIDER_API_KEY="sk-xxx" COPILOT_MODEL="gpt-5.4" COPILOT_PROVIDER_WIRE_API="responses" waza suggest skills/accelint-ts-best-practices --apply --force
```

Sonnet 4.5
```
COPILOT_PROVIDER_BASE_URL="https://litellm-ai.accelint.dev" COPILOT_PROVIDER_API_KEY="sk-xxx" COPILOT_MODEL="bedrock-claude-4-5-sonnet" COPILOT_PROVIDER_WIRE_API="completions" waza suggest skills/accelint-qrspi-propose --apply --force
```