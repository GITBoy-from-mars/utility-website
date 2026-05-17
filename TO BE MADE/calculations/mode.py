import pandas as pd
from collections import Counter

def calculate(data, selected_columns, headers, additional_data={}):
    """
    Calculate mode for selected columns using Counter
    """
    try:
        if not data or len(data) == 0:
            return "No data provided for calculation"
            
        if not selected_columns or len(selected_columns) == 0:
            return "No columns selected for calculation"
            
        # Convert data to DataFrame
        df = pd.DataFrame(data, columns=headers[:len(data[0])] if data else headers)
        
        results = {}
        
        for col_idx in selected_columns:
            if col_idx >= len(headers):
                continue
                
            col_name = headers[col_idx]
            col_data = df.iloc[:, col_idx] if col_idx < df.shape[1] else pd.Series([])
            
            # Remove null/empty values and convert to list
            clean_data = col_data.dropna()
            clean_data = clean_data[clean_data != ''].tolist()
            
            if len(clean_data) > 0:
                try:
                    # Use Counter to find most common values
                    counter = Counter(clean_data)
                    most_common = counter.most_common()
                    
                    if most_common:
                        # Get the highest frequency
                        max_frequency = most_common[0][1]
                        
                        # Find all values with the highest frequency
                        modes = [value for value, freq in most_common if freq == max_frequency]
                        
                        if len(modes) == 1:
                            mode_display = str(modes[0])
                        else:
                            mode_display = f"Multiple modes: {', '.join(map(str, modes))}"
                        
                        results[col_name] = {
                            'mode': mode_display,
                            'frequency': max_frequency,
                            'total_cases': len(col_data),
                            'valid_cases': len(clean_data),
                            'missing_cases': len(col_data) - len(clean_data),
                            'unique_values': len(counter),
                            'percentage': round((max_frequency / len(clean_data)) * 100, 2)
                        }
                    else:
                        results[col_name] = {
                            'error': 'No data found to calculate mode'
                        }
                        
                except Exception as e:
                    results[col_name] = {
                        'error': f'Error in mode calculation: {str(e)}'
                    }
            else:
                results[col_name] = {
                    'error': 'No valid data found in this column'
                }
        
        # Format results for display
        if not results:
            return "No valid columns found for calculation"
            
        result_html = "<div style='font-family: Arial, sans-serif;'>"
        
        for col, result_data in results.items():
            if 'error' in result_data:
                result_html += f"""
                <div style='margin-bottom: 15px; padding: 10px; background: #ffebee; border-left: 4px solid #f44336;'>
                    <strong>{col}:</strong> {result_data['error']}
                </div>
                """
            else:
                result_html += f"""
                <div style='margin-bottom: 15px; padding: 10px; background: #fff3e0; border-left: 4px solid #ff9800;'>
                    <strong>Columns {col}:</strong><br>
                    <strong>Mode:</strong> {result_data['mode']}<br>
                    <strong>Frequency:</strong> {result_data['frequency']} ({result_data['percentage']}%)<br>
                    <strong>Number of Observations:</strong> {result_data['valid_cases']}<br>
                    <strong>Unique Samples:</strong> {result_data['unique_values']}<br>
                   
                </div>
                """
        
        result_html += "</div>"
        return result_html
        
    except Exception as e:
        return f"<div style='color: red; font-family: Arial;'>Error calculating mode: {str(e)}</div>"

# <strong>Total Cases:</strong> {result_data['total_cases']}
#  {f"<br><strong>Missing:</strong> {result_data['missing_cases']}" if result_data['missing_cases'] > 0 else ""}