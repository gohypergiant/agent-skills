# 3.1 Input Validation

Always validate and sanitize external data at system boundaries. Treat external input as untrusted until validation succeeds.

**❌ Incorrect: assumes input is already valid**
```ts
function validateAddress(userInput: any) {
  return userInput;
}
```

**✅ Correct: validate unknown input with a schema**
```ts
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string().length(5),
});

type Address = z.infer<typeof AddressSchema>;

function validateAddress(userInput: unknown): Address {
  return AddressSchema.parse(userInput);
}
```

**Why this matters**:

1. `unknown` keeps unsafe data at the boundary until validation runs.
2. Schema validation turns malformed input into an explicit failure instead of silent corruption.
3. Returning the validated type gives downstream code a safe contract.
