import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private var trainingDisplayChannel: FlutterMethodChannel?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    let channel = FlutterMethodChannel(
      name: "dev.mhgd.flare/training_display",
      binaryMessenger: engineBridge.applicationRegistrar.messenger()
    )
    trainingDisplayChannel = channel
    channel.setMethodCallHandler { call, result in
      switch call.method {
      case "isKeepAwake":
        // Read-only verification. The shared SDK owns wakelock_plus; a second
        // lifecycle observer must not release its reference-counted hold.
        result(UIApplication.shared.isIdleTimerDisabled)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }
}
