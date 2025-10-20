import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("token");
    await prefs.remove("rol");
    await prefs.clear();
  }
}
