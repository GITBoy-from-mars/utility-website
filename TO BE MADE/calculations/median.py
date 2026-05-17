# import pandas as pd
# import numpy as np

# def calculate(data, selected_columns, headers, additional_data={}):
#     """
#     Calculate median for selected columns
#     """
#     try:
#         if not data or len(data) == 0:
#             return "No data provided for calculation"
            
#         if not selected_columns or len(selected_columns) == 0:
#             return "No columns selected for calculation"
            
#         # Convert data to DataFrame
#         df = pd.DataFrame(data, columns=headers[:len(data[0])] if data else headers)
        
#         results = {}
        
#         for col_idx in selected_columns:
#             if col_idx >= len(headers):
#                 continue
                
#             col_name = headers[col_idx]
#             col_data = df.iloc[:, col_idx] if col_idx < df.shape[1] else pd.Series([])
            
#             # Convert to numeric, ignoring non-numeric values
#             numeric_data = pd.to_numeric(col_data, errors='coerce').dropna()
            
#             if len(numeric_data) > 0:
#                 median_value = np.median(numeric_data)
#                 results[col_name] = {
#                     'median': round(median_value, 4),
#                     'count': len(numeric_data),
#                     'total_cases': len(col_data),
#                     'missing_cases': len(col_data) - len(numeric_data)
#                 }
#             else:
#                 results[col_name] = {
#                     'error': 'No valid numeric data found in this column'
#                 }
        
#         # Format results for display
#         if not results:
#             return "No valid columns found for calculation"
            
#         result_html = "<div style='font-family: Arial, sans-serif;'>"
        
#         for col, stats in results.items():
#             if 'error' in stats:
#                 result_html += f"""
#                 <div style='margin-bottom: 15px; padding: 10px; background: #ffebee; border-left: 4px solid #f44336;'>
#                     <strong>{col}:</strong> {stats['error']}
#                 </div>
#                 """
#             else:
#                 result_html += f"""
#                 <div style='margin-bottom: 15px; padding: 10px; background: #e8f5e8; border-left: 4px solid #4caf50;'>
#                     <strong>Columns {col}</strong><br>
#                     <strong>Median:</strong> {stats['median']}<br>
#                     <strong>Number of Observations:</strong> {stats['count']}<br>
                   
#                 </div>
#                 """
        
#         result_html += "</div>"
#         return result_html
        
#     except Exception as e:
#         return f"<div style='color: red; font-family: Arial;'>Error calculating median: {str(e)}</div>"
    
    
    
# # <strong>Total Cases:</strong> {stats['total_cases']}
# #  {f"<br><strong>Missing:</strong> {stats['missing_cases']}" if stats['missing_cases'] > 0 else ""}

















import pandas as pd
import numpy as np

def calculate(data, selected_columns, headers, additional_data={}):
    """
    Calculate median for selected columns
    """
    try:
        if not data or len(data) == 0:
            return "No data provided for calculation"
        if not selected_columns or len(selected_columns) == 0:
            return "No columns selected for calculation"

        df = pd.DataFrame(data, columns=headers[:len(data[0])] if data else headers)

        results = {}
        for col_idx in selected_columns:
            if col_idx >= len(headers):
                continue
            col_name = headers[col_idx]
            col_data = df.iloc[:, col_idx] if col_idx < df.shape[1] else pd.Series([])
            numeric_data = pd.to_numeric(col_data, errors='coerce').dropna()

            if len(numeric_data) > 0:
                median_value = np.median(numeric_data)
                results[col_name] = {
                    'median': round(median_value, 4),
                    'count': len(numeric_data),
                    'total_cases': len(col_data),
                    'missing_cases': len(col_data) - len(numeric_data)
                }
            else:
                results[col_name] = {'error': 'No valid numeric data found in this column'}

        if not results:
            return "No valid columns found for calculation"

        # ------- visible output (unchanged) -------
        result_html = "<div style='font-family: Arial, sans-serif;'>"
        for col, stats in results.items():
            if 'error' in stats:
                result_html += f"""
                <div style='margin-bottom: 15px; padding: 10px; background: #ffebee; border-left: 4px solid #f44336;'>
                    <strong>{col}:</strong> {stats['error']}
                </div>
                """
            else:
                result_html += f"""
                <div style='margin-bottom: 15px; padding: 10px; background: #e8f5e8; border-left: 4px solid #4caf50;'>
                    <strong>Columns {col}</strong><br>
                    <strong>Median:</strong> {stats['median']}<br>
                    <strong>Number of Observations:</strong> {stats['count']}<br>
                </div>
                """

            export_rows = []
            for col, stats in results.items():
                if 'error' in stats:
                    continue
                med = stats.get('median')
                n   = stats.get('count', 0)
                miss = stats.get('missing_cases', max(0, stats.get('total_cases', n) - n))
                med_txt = "—" if med is None else f"{float(med):.4f}"
                export_rows.append((col, med_txt, str(n), str(miss)))

            if export_rows:
                result_html += (
                    "<table class='export-table' style='display:none'>"
                    "<thead><tr><th>Variable</th><th>Median</th><th>N</th><th>Missing</th></tr></thead><tbody>"
                    + "".join(f"<tr><td>{v}</td><td>{m}</td><td>{n}</td><td>{ms}</td></tr>"
                            for v, m, n, ms in export_rows)
                    + "</tbody></table>"
                )


        # close wrapper
        result_html += "</div>"


        return result_html

    except Exception as e:
        return f"<div style='color: red; font-family: Arial;'>Error calculating median: {str(e)}</div>"
