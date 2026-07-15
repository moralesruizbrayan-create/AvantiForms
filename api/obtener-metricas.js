import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Configuramos los headers para CORS y tipo de respuesta JSON
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        try:
            # Conexión directa a Neon PostgreSQL usando la variable de entorno
            DATABASE_URL = os.environ.get('DATABASE_URL')
            conn = psycopg2.connect(DATABASE_URL)
            cursor = conn.cursor(cursor_factory=RealDictCursor)

            # --- CONSULTA 1: KPIs (Stock, Asignados, Reparación) ---
            cursor.execute("""
                SELECT estado_operativo, COUNT(*) as total 
                FROM activos_hardware 
                GROUP BY estado_operativo;
            """)
            resultados_kpi = cursor.fetchall()
            
            # Inicializamos variables
            kpis = {'stock': 0, 'asignados': 0, 'reparacion': 0}
            for fila in resultados_kpi:
                estado = fila['estado_operativo'].upper()
                if estado == 'STOCK':
                    kpis['stock'] = fila['total']
                elif estado == 'OPERATIVO':
                    kpis['asignados'] = fila['total']
                elif estado == 'REPARACION':
                    kpis['reparacion'] = fila['total']

            # --- CONSULTA 2: Datos para el Gráfico (Distribución por Tipo) ---
            cursor.execute("""
                SELECT tipo_hardware, COUNT(*) as total 
                FROM activos_hardware 
                GROUP BY tipo_hardware;
            """)
            resultados_grafico = cursor.fetchall()
            
            etiquetas = []
            valores = []
            for fila in resultados_grafico:
                etiquetas.append(fila['tipo_hardware'])
                valores.append(fila['total'])

            # Construimos el JSON final para que el Frontend (Chart.js) lo consuma
            respuesta_json = {
                "kpis": kpis,
                "grafico": {
                    "etiquetas": etiquetas,
                    "valores": valores
                }
            }

            # Cerramos conexiones
            cursor.close()
            conn.close()

            # Enviamos la respuesta al cliente
            self.wfile.write(json.dumps(respuesta_json).encode('utf-8'))

        except Exception as e:
            # Manejo de errores seguro
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
