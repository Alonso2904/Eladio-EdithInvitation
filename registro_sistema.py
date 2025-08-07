import json
import os
from datetime import datetime

class RegistroSistema:
    def __init__(self):
        self.archivo_registros = 'registros.txt'
        self.archivo_json = 'registros.json'
    
    def guardar_registro(self, nombre, asistencia, personas, mensaje):
        """Guarda el registro en formato de tabla en archivo de texto"""
        fecha = datetime.now().strftime("%d/%m/%Y")
        hora = datetime.now().strftime("%H:%M:%S")
        
        # Crear archivo si no existe
        if not os.path.exists(self.archivo_registros):
            with open(self.archivo_registros, 'w', encoding='utf-8') as f:
                f.write("=" * 80 + "\n")
                f.write("REGISTROS DE INVITADOS - INVITACIÓN DE BODA\n")
                f.write("=" * 80 + "\n\n")
                f.write(f"{'FECHA':<12}{'HORA':<10}{'NOMBRE':<25}{'ASISTENCIA':<12}{'PERSONAS':<10}{'MENSAJE'}\n")
                f.write("-" * 80 + "\n")
        
        # Agregar nuevo registro
        with open(self.archivo_registros, 'a', encoding='utf-8') as f:
            nombre_corto = nombre[:22] + "..." if len(nombre) > 25 else nombre
            mensaje_corto = mensaje[:30] + "..." if len(mensaje) > 33 else mensaje
            f.write(f"{fecha:<12}{hora:<10}{nombre_corto:<25}{asistencia:<12}{personas:<10}{mensaje_corto}\n")
        
        # También guardar en JSON
        self.guardar_json(nombre, asistencia, personas, mensaje)
        
        return True
    
    def guardar_json(self, nombre, asistencia, personas, mensaje):
        """Guarda el registro en formato JSON"""
        registro = {
            'fecha': datetime.now().strftime("%d/%m/%Y %H:%M:%S"),
            'nombre': nombre,
            'asistencia': asistencia,
            'personas': personas,
            'mensaje': mensaje
        }
        
        registros = []
        if os.path.exists(self.archivo_json):
            with open(self.archivo_json, 'r', encoding='utf-8') as f:
                registros = json.load(f)
        
        registros.append(registro)
        
        with open(self.archivo_json, 'w', encoding='utf-8') as f:
            json.dump(registros, f, ensure_ascii=False, indent=2)
    
    def obtener_registros(self):
        """Obtiene todos los registros"""
        if os.path.exists(self.archivo_registros):
            with open(self.archivo_registros, 'r', encoding='utf-8') as f:
                return f.read()
        return "No hay registros aún."
    
    def obtener_total_registros(self):
        """Obtiene el total de registros"""
        if os.path.exists(self.archivo_json):
            with open(self.archivo_json, 'r', encoding='utf-8') as f:
                registros = json.load(f)
                return len(registros)
        return 0

# Función para usar en el script
def guardar_registro_local(nombre, asistencia, personas, mensaje):
    sistema = RegistroSistema()
    return sistema.guardar_registro(nombre, asistencia, personas, mensaje)

if __name__ == "__main__":
    # Demo de uso
    guardar_registro_local("Carlos Alberto", "Sí, asistiré", "2", "¡Felicitaciones!")
    print("Registro guardado exitosamente")
    print("Total de registros:", RegistroSistema().obtener_total_registros())
