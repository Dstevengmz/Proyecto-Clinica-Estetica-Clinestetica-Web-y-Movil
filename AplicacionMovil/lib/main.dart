import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import './rutas.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:calendar_view/calendar_view.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:syncfusion_localizations/syncfusion_localizations.dart';

void main() async {
  await dotenv.load();
  await initializeDateFormatting('es_ES', null);
  runApp(
    CalendarControllerProvider(
      controller: EventController(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final brandGreen = const Color(0xFF2E7D32); // verde
    final brandGreenLight = const Color(0xFF66BB6A);
    final brandWhite = Colors.white;

    final theme = ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: brandGreen,
        primary: brandGreen,
        secondary: brandGreenLight,
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: brandWhite,
      appBarTheme: AppBarTheme(
        backgroundColor: brandGreen,
        foregroundColor: brandWhite,
        elevation: 1,
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: brandGreen,
          foregroundColor: brandWhite,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
          ),
        ),
      ),
      inputDecorationTheme: const InputDecorationTheme(
        border: OutlineInputBorder(),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: brandGreenLight.withOpacity(0.15),
        selectedColor: brandGreenLight,
      ),
    );

    return MaterialApp.router(
      title: 'Mi App Flutter',
      debugShowCheckedModeBanner: false,
      theme: theme,
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        SfGlobalLocalizations.delegate,
      ],
      supportedLocales: const [Locale('es', 'ES'), Locale('es', '')],
      locale: const Locale('es', 'ES'),
      routerConfig: appRouter,
    );
  }
}
