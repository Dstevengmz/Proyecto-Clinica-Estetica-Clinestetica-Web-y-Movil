enum TipoDocumento {
  cedulaCiudadania,
  pasaporte,
  documentoExtranjero,
  permisoPermanencia,
}

extension TipoDocumentoExtension on TipoDocumento {
  String get nombre {
    switch (this) {
      case TipoDocumento.cedulaCiudadania:
        return 'Cédula de Ciudadanía';
      case TipoDocumento.pasaporte:
        return 'Pasaporte';
      case TipoDocumento.documentoExtranjero:
        return 'Documento de Identificación Extranjero';
      case TipoDocumento.permisoPermanencia:
        return 'Permiso Especial de Permanencia';
    }
  }
}
