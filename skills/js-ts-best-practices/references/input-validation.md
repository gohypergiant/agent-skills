# 3.1 Input Validation

Always validate and sanitize external data at system boundaries.

**❌ Incorrect: assumes valid**
```ts
function validateAddress(userInput: any) {
  return userInput;
}
```

**✅ Correct: asserts validity**
```ts
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zipCode: z.string().length(5),
});

type Address = z.infer<typeof AddressSchema>;

function validateAddress(userInput: Address) {
  return AddressSchema.safeParse(userInput);
}
```
