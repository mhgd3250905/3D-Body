import java.util.Properties

plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties().apply {
    if (keystorePropertiesFile.exists()) {
        keystorePropertiesFile.inputStream().use { load(it) }
    }
}

// HipLab (开胯训练助手) shares this Android project. It is selected by the
// Flutter target, so FlareLab's commands stay exactly as before:
//   flutter build apk                          -> dev.mhgd.flare, "Flare 托马斯"
//   flutter build apk -t lib/main_hip.dart     -> com.ugk.hiplab, "开胯训练助手"
// `--dart-define=APP_VARIANT=hip` selects it as well (for tooling that
// cannot pass -t). Both Flutter values arrive as Gradle project properties.
val flutterTarget = (project.findProperty("target") as String?) ?: ""
val flutterDartDefines = ((project.findProperty("dart-defines") as String?) ?: "")
    .split(",")
    .filter { it.isNotBlank() }
    .map { String(java.util.Base64.getDecoder().decode(it)) }
val isHipLab = flutterTarget.replace('\\', '/').endsWith("lib/main_hip.dart") ||
    flutterDartDefines.contains("APP_VARIANT=hip")

android {
    namespace = "dev.mhgd.flare"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = if (isHipLab) "com.ugk.hiplab" else "dev.mhgd.flare"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        versionCode = flutter.versionCode
        versionName = flutter.versionName
        manifestPlaceholders["appLabel"] = if (isHipLab) "开胯训练助手" else "Flare 托马斯"
        manifestPlaceholders["appIcon"] = if (isHipLab) "@mipmap/ic_launcher_hip" else "@mipmap/ic_launcher"
    }

    if (keystorePropertiesFile.exists()) {
        signingConfigs {
            create("release") {
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
                storeFile = file(keystoreProperties.getProperty("storeFile") as String)
                storePassword = keystoreProperties.getProperty("storePassword")
            }
        }
    }

    buildTypes {
        release {
            // Without android/key.properties (e.g. on another machine) keep the
            // historical debug-signed behavior so builds still succeed.
            signingConfig = if (keystorePropertiesFile.exists()) {
                signingConfigs.getByName("release")
            } else {
                signingConfigs.getByName("debug")
            }
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}
