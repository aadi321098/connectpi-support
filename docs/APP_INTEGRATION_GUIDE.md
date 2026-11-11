# ConnectPi Client Applications Integration Guide

This guide provides drop-in snippets for integrating `support.connectpi.in` links into ConnectPi Web, ConnectPi Mobile App (React Native & Flutter), and Blade Rush.

---

## URL Scheme & Deep Linking Pattern

All contextual help links should route directly to the relevant product, category, or specific article with query parameter tracking:

- **Help Center Home:** `https://support.connectpi.in/?from={app_source}`
- **Product Hub:** `https://support.connectpi.in/{product}?from={app_source}`
- **Category View:** `https://support.connectpi.in/{product}/{category}?from={app_source}`
- **Specific Article:** `https://support.connectpi.in/{product}/{category}/{slug}?from={app_source}`
- **Direct Support Contact:** `https://support.connectpi.in/contact?product={product}&from={app_source}`

*Allowed values for `from`:* `connectpi-web`, `connectpi-android`, `connectpi-ios`, `blade-rush`.

---

## 1. ConnectPi Web App (React / Next.js)

### Footer Support Links Component (`SupportFooterLinks.tsx`)
```tsx
import React from "react";

interface SupportLinkProps {
  product?: "connectpi-web" | "blade-rush";
  category?: string;
  article?: string;
  label: string;
}

export function SupportLink({ product = "connectpi-web", category, article, label }: SupportLinkProps) {
  let href = "https://support.connectpi.in";

  if (category && article) {
    href += `/${product}/${category}/${article}`;
  } else if (category) {
    href += `/${product}/${category}`;
  } else if (product) {
    href += `/${product}`;
  }

  href += "?from=connectpi-web";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-white transition-colors text-sm"
    >
      {label}
    </a>
  );
}

export function SupportFooter() {
  return (
    <div className="flex gap-4">
      <SupportLink label="Help Center" />
      <SupportLink category="getting-started" article="quickstart-guide" label="Quickstart" />
      <SupportLink category="account-security" label="Account Security" />
      <a
        href="https://support.connectpi.in/contact?product=connectpi-web&from=connectpi-web"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-white transition-colors text-sm"
      >
        Contact Support
      </a>
    </div>
  );
}
```

---

## 2. ConnectPi Mobile App (React Native)

### In-App Browser Helper (`openSupport.ts`)
```typescript
import { Linking, Alert, Platform } from "react-native";
// Or use: import * as WebBrowser from "expo-web-browser";

interface OpenSupportOptions {
  product?: "connectpi-app" | "blade-rush";
  category?: string;
  slug?: string;
}

export async function openSupportHelp({
  product = "connectpi-app",
  category,
  slug,
}: OpenSupportOptions = {}): Promise<void> {
  const source = Platform.OS === "ios" ? "connectpi-ios" : "connectpi-android";
  let url = "https://support.connectpi.in";

  if (category && slug) {
    url += `/${product}/${category}/${slug}`;
  } else if (category) {
    url += `/${product}/${category}`;
  } else if (product) {
    url += `/${product}`;
  }

  url += `?from=${source}`;

  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      // Or: await WebBrowser.openBrowserAsync(url);
    } else {
      Alert.alert("Unable to open browser", "Please visit https://support.connectpi.in");
    }
  } catch (error) {
    console.warn("Failed to open support URL:", error);
  }
}
```

### Settings Screen Row Usage:
```tsx
import { TouchableOpacity, Text } from "react-native";
import { openSupportHelp } from "./openSupport";

export function HelpSettingsRow() {
  return (
    <TouchableOpacity
      onPress={() => openSupportHelp({ category: "account-settings" })}
      style={{ padding: 16, flexDirection: "row", justifyContent: "space-between" }}
    >
      <Text style={{ fontSize: 16 }}>Help & Support</Text>
      <Text style={{ color: "#5B2FC9" }}>Visit →</Text>
    </TouchableOpacity>
  );
}
```

---

## 3. Flutter (Blade Rush / Mobile)

### Flutter Support Service (`support_service.dart`)
```dart
import 'dart:io';
import 'package:url_launcher/url_launcher.dart';

class SupportService {
  static const String baseUrl = 'https://support.connectpi.in';

  static Future<void> openHelp({
    String product = 'blade-rush',
    String? category,
    String? slug,
  }) async {
    final String source = Platform.isIOS ? 'connectpi-ios' : 'connectpi-android';
    String path = '';

    if (category != null && slug != null) {
      path = '/$product/$category/$slug';
    } else if (category != null) {
      path = '/$product/$category';
    } else {
      path = '/$product';
    }

    final Uri uri = Uri.parse('$baseUrl$path?from=$source');

    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    } else {
      throw 'Could not launch $uri';
    }
  }
}
```
