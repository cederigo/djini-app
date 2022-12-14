package ch.djini;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.microsoft.codepush.react.CodePush;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(new MainReactPackage(),
            new GoogleAnalyticsBridgePackage(), new ReactNativePushNotificationPackage(),
          new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey),
              getApplicationContext(), BuildConfig.DEBUG),
          new LinearGradientPackage(), new ImagePickerPackage(), new VectorIconsPackage(), new ReactNativeContacts());
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
