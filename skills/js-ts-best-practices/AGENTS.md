# JavaScript and TypeScript Best Practices

> **Note:**  
> This document is mainly for agents and LLMs to follow when maintaining,  
> generating, or refactoring JavaScript or TypeScript code at Accelint. 
> Humans may also find it useful, but guidance here is optimized for automation  
> and consistency by AI-assisted workflows.

---

## Abstract

Comprehensive performance optimization guide for JavaScript or TypeScript applications, designed for AI agents and LLMs. Rules are prioritized by impact from critical to incremental. Each rule includes detailed explanations, and real-world examples comparing incorrect vs. correct implementations to guide automated refactoring and code generation.

---

## Table of Contents

1. [General](#1-general)
    - 1.1 [Naming Conventions](#11-naming-conventions)
    - 1.2 [Functions](#12-functions)
    - 1.3 [Control Flow](#13-control-flow)
    - 1.4 [State Management](#14-state-management)
    - 1.5 [Return Values](#15-return-values)
    - 1.6 [Misc](#16-misc)
2. [TypeScript](#2-typescript)
3. [Safety](#3-safety)
    - 3.1 [Input Validation](#31-input-validation)
    - 3.2 [Assertions](#32-assertions)
    - 3.3 [Error Handling](#33-error-handling)
    - 3.4 [Error Messages](#34-error-messages)
4. [Performance](#4-performance)

---

## 1. General

### 1.1 Naming Conventions

Use descriptive, meaningful names. Stick to complete words unless abbreviation is widely recognized (ID, URL, RCS).

**❌ Incorrect: non descriptive and meaning cannot be inferred**
```ts
const usrNm = /**/;
const a = /**/;
let data;
```

**✅ Correct: descriptive and meaningful**
```ts
const numberOfProducts = /**/;
const customerList = /**/;
const radarCrossSection = lookupCrossSection(entity.platformType);
```

For units and qualifiers append in descending order of significance.

**❌ Incorrect: max qualifier is not appended**
```ts
const maxLatencyMs = /**/;
```

**✅ Correct: qualifiers appended and in correct order**
```ts
const latencyMsMax = /**/;
const latencyMsMin = /**/;
```

For Booleans prefix with `is` or `has`.

**❌ Incorrect: no is or has prefix**
```ts
const visible = true;
const children = false;
```

**✅ Correct: contains is or has prefix**
```ts
const isVisible = true;
const hasChildren = false;
```

### 1.2 Functions

### 1.3 Control Flow

### 1.4 State Management

### 1.5 Return Values

### 1.6 Misc

---

## 2. TypeScript

---

## 3. Safety

### 3.1 Input Validation

### 3.2 Assertions

### 3.3 Error Handling

### 3.4 Error Messages

---

## 4. Performance