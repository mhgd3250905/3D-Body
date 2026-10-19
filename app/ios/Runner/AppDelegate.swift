import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private var trainingDisplayChannel: FlutterMethodChannel?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    NotificationCenter.default.addObserver(
      self, selector: #selector(releaseTrainingDisplay),
      name: UIApplication.willResignActiveNotification, object: nil
    )
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
      case "setKeepAwake":
        guard let enabled = call.arguments as? Bool else {
          result(FlutterError(code: "invalid_argument", message: "Expected a boolean", details: nil))
          return
        }
        UIApplication.shared.isIdleTimerDisabled =
          enabled && UIApplication.shared.applicationState == .active
        result(nil)
      case "isKeepAwake":
        result(UIApplication.shared.isIdleTimerDisabled)
      default:
        result(FlutterMethodNotImplemented)
      }
    }
  }

  @objc private func releaseTrainingDisplay() {
    UIApplication.shared.isIdleTimerDisabled = false
  }
}
