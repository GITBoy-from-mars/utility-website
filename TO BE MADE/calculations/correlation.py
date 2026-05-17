















# # import pandas as pd
# # import numpy as np
# # from scipy.stats import pearsonr, spearmanr, kendalltau
# # from sklearn.metrics import pairwise_distances
# # from statsmodels.stats.api import partial_corr
# # # from statsmodels.stats.partial_corr import partial_corr

# # def calculate(data, selected_columns, headers, additional_data={}):
# #     try:
# #         if not data or len(data) == 0:
# #             return "No data provided for calculation"
# #         df = pd.DataFrame(data, columns=headers[:len(data[0])] if data else headers)

# #         group1 = additional_data.get('group1', [])
# #         group2 = additional_data.get('group2', [])
# #         controls = additional_data.get('controls', [])
# #         method = additional_data.get('method', 'bivariate')
# #         selected_names1 = [headers[i] for i in group1 if i < len(headers)]
# #         selected_names2 = [headers[i] for i in group2 if i < len(headers)]
# #         controls_names = [headers[i] for i in controls if i < len(headers)]
# #         result_html = "<div style='font-family: Arial, sans-serif;'>"

# #         # Prepare numeric data
# #         for col in selected_names1 + selected_names2 + controls_names:
# #             df[col] = pd.to_numeric(df[col], errors='coerce')

# #         clean_df = df.dropna(subset=selected_names1 + selected_names2 + controls_names)
# #         if len(clean_df) < 2:
# #             return "Insufficient data for correlation analysis (need at least 2 complete rows)"

# #         # Bivariate correlation (Pearson/Spearman/Kendall) between group1/group2 or within group1
# #         if method == 'bivariate':
# #             cols1 = selected_names1
# #             cols2 = selected_names2 if selected_names2 else selected_names1
# #             for i, col1 in enumerate(cols1):
# #                 for j, col2 in enumerate(cols2):
# #                     # Prevent repeat pairs if within same group
# #                     if selected_names2 == [] and j <= i:
# #                         continue
# #                     x, y = clean_df[col1], clean_df[col2]
# #                     if len(x.unique()) < 2 or len(y.unique()) < 2:
# #                         result_html += f"<div><strong>{col1} vs {col2}:</strong> Insufficient data</div>"
# #                         continue
# #                     try:
# #                         r, p = pearsonr(x, y)
# #                         method_name = "Pearson"
# #                         strength = ("Strong" if abs(r)>=0.7 else
# #                                     "Moderate" if abs(r)>=0.3 else
# #                                     "Weak" if abs(r)>=0.1 else "None")
# #                         direction = "Positive" if r > 0 else "Negative" if r < 0 else "None"
# #                         result_html += f"""
# #                         <div style='margin-bottom:15px;padding:10px;background:#e3f2fd;'>
# #                           <strong>{col1} vs {col2} ({method_name}):</strong><br>
# #                           Correlation: {round(r,4)}<br>
# #                           P-value: {round(p,4)}<br>
# #                           Strength: {strength} ({direction})
# #                         </div>
# #                         """
# #                     except Exception as e:
# #                         result_html += f"<div><strong>{col1} vs {col2}:</strong> Calculation error: {e}</div>"

# #         # Partial correlation using controls
# #         elif method == 'partial':
# #             if not controls_names:
# #                 return "Partial correlation needs controls."
# #             cols = selected_names1 + selected_names2
# #             for i, col1 in enumerate(cols):
# #                 for j, col2 in enumerate(cols):
# #                     if j <= i: continue
# #                     try:
# #                         pcorr_res = partial_corr(data=clean_df, x=col1, y=col2, covar=controls_names, method="pearson")
# #                         r = pcorr_res['r']
# #                         p = pcorr_res['p-val']
# #                         result_html += f"""
# #                         <div style='margin-bottom:15px;padding:10px;background:#e1f5fe;'>
# #                           <strong>Partial Corr: {col1} vs {col2} controlling for {', '.join(controls_names)}:</strong><br>
# #                           Partial r: {round(r,4)}<br>
# #                           P-value: {round(p,4)}
# #                         </div>
# #                         """
# #                     except Exception as e:
# #                         result_html += f"<div><strong>{col1} vs {col2}:</strong> Calculation error: {e}</div>"

# #         # Pairwise Euclidean Distances
# #         elif method == 'distances':
# #             cols = selected_names1 + selected_names2
# #             arr = clean_df[cols].to_numpy()
# #             try:
# #                 dist_matrix = pairwise_distances(arr, metric='euclidean')
# #                 result_html += "<div><strong>Pairwise Euclidean Distances:</strong><br><table border='1' cellpadding='5'><tr><th></th>"
# #                 result_html += "".join([f"<th>Obs {i+1}</th>" for i in range(dist_matrix.shape[0])])
# #                 result_html += "</tr>"
# #                 for i, row in enumerate(dist_matrix):
# #                     result_html += f"<tr><th>Obs {i+1}</th>"
# #                     result_html += "".join([f"<td>{round(val,2)}</td>" for val in row])
# #                     result_html += "</tr>"
# #                 result_html += "</table></div>"
# #             except Exception as e:
# #                 result_html += f"<div><strong>Distances Error:</strong> {e}</div>"

# #         else:
# #             result_html += "<div>Unknown method.</div>"

# #         result_html += "</div>"
# #         return result_html

# #     except Exception as e:
# #         return f"<div style='color: red; font-family: Arial;'>Error calculating correlation: {str(e)}</div>"









# import pandas as pd
# import numpy as np
# from scipy.stats import pearsonr, spearmanr, kendalltau
# from sklearn.metrics import pairwise_distances

# def _partial_correlation(x, y, controls_df):
#     """
#     Compute partial correlation between x and y controlling for controls_df
#     via regression residuals.
#     """
#     # Prepare design matrix with intercept
#     X = controls_df.values
#     X = np.column_stack([np.ones(len(X)), X])
#     # Regress x
#     beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
#     res_x = x.values - X.dot(beta_x)
#     # Regress y
#     beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
#     res_y = y.values - X.dot(beta_y)
#     # Correlate residuals
#     return pearsonr(res_x, res_y)

# def calculate(data, selected_columns, headers, additional_data={}):
#     """
#     data: list of rows (lists)
#     selected_columns: list of ints
#     headers: list of column names
#     additional_data: dict with keys:
#       - method: 'bivariate', 'partial', or 'distances'
#       - group1: list of ints
#       - group2: list of ints (optional)
#       - controls: list of ints (for partial)
#     """
#     try:
#         if not data:
#             return "No data provided."
#         # Build DataFrame
#         df = pd.DataFrame(data, columns=headers[:len(data[0])])
#         method = additional_data.get('method', 'bivariate')
#         group1 = additional_data.get('group1', [])
#         group2 = additional_data.get('group2', [])
#         controls = additional_data.get('controls', [])
#         names1 = [headers[i] for i in group1 if i < len(headers)]
#         names2 = [headers[i] for i in group2 if i < len(headers)]
#         ctrl_names = [headers[i] for i in controls if i < len(headers)]

#         # Convert columns to numeric
#         for col in set(names1 + names2 + ctrl_names):
#             df[col] = pd.to_numeric(df[col], errors='coerce')

#         # Drop rows with NaNs in any selected column
#         cols_to_drop = names1 + names2 + ctrl_names
#         clean = df.dropna(subset=cols_to_drop)
#         if len(clean) < 2:
#             return "Insufficient complete data (need ≥2 rows)."

#         result_html = "<div style='font-family: Arial;'>"

#         # Bivariate correlation
#         if method == 'bivariate':
#             cols_a = names1
#             cols_b = names2 or names1
#             for i, a in enumerate(cols_a):
#                 for j, b in enumerate(cols_b):
#                     if cols_b is cols_a and j <= i:
#                         continue
#                     x, y = clean[a], clean[b]
#                     if x.nunique()<2 or y.nunique()<2:
#                         result_html += f"<p><strong>{a} vs {b}:</strong> Insufficient variation.</p>"
#                         continue
#                     r, p = pearsonr(x, y)
#                     strength = ("Strong" if abs(r)>=0.7 else
#                                 "Moderate" if abs(r)>=0.3 else
#                                 "Weak" if abs(r)>=0.1 else "None")
#                     dirn = "Positive" if r>0 else "Negative" if r<0 else "None"
#                     result_html += (
#                         f"<div style='margin:8px 0;padding:8px;"
#                         "background:#e3f2fd;border-left:4px solid #1976d2;'>"
#                         f"<strong>{a} vs {b} (Pearson):</strong><br>"
#                         f"r = {r:.4f}, p = {p:.4f}<br>"
#                         f"Strength: {strength} ({dirn})"
#                         "</div>"
#                     )

#         # Partial correlation
#         elif method == 'partial':
#             if not ctrl_names:
#                 return "Select control variables for partial correlation."
#             cols = names1 + names2 or names1
#             for i, a in enumerate(cols):
#                 for j, b in enumerate(cols):
#                     if j <= i:
#                         continue
#                     x, y = clean[a], clean[b]
#                     ctrl_df = clean[ctrl_names]
#                     try:
#                         r, p = _partial_correlation(x, y, ctrl_df)
#                     except Exception as e:
#                         result_html += (
#                             f"<p><strong>{a} vs {b} partial:</strong> Error: {e}</p>"
#                         )
#                         continue
#                     strength = ("Strong" if abs(r)>=0.7 else
#                                 "Moderate" if abs(r)>=0.3 else
#                                 "Weak" if abs(r)>=0.1 else "None")
#                     dirn = "Positive" if r>0 else "Negative" if r<0 else "None"
#                     result_html += (
#                         f"<div style='margin:8px 0;padding:8px;"
#                         "background:#e1f5fe;border-left:4px solid #0288d1;'>"
#                         f"<strong>{a} vs {b} (Partial):</strong><br>"
#                         f"r = {r:.4f}, p = {p:.4f}<br>"
#                         f"Strength: {strength} ({dirn})"
#                         "</div>"
#                     )

#         # Pairwise distances
#         elif method == 'distances':
#             cols = names1 + names2
#             arr = clean[cols].to_numpy()
#             dist = pairwise_distances(arr, metric='euclidean')
#             # Table header
#             result_html += "<p><strong>Euclidean Distances:</strong></p>"
#             result_html += "<table border='1' cellpadding='4'><tr><th></th>"
#             result_html += "".join(f"<th>Obs {i+1}</th>" for i in range(dist.shape[0]))
#             result_html += "</tr>"
#             for i, row in enumerate(dist):
#                 result_html += "<tr>"
#                 result_html += f"<th>Obs {i+1}</th>"
#                 result_html += "".join(f"<td>{val:.2f}</td>" for val in row)
#                 result_html += "</tr>"
#             result_html += "</table>"

#         else:
#             result_html += f"<p>Unknown method: {method}</p>"

#         result_html += "</div>"
#         return result_html

#     except Exception as ex:
#         return f"<div style='color:red;font-family:Arial;'>Error: {ex}</div>"

















# import pandas as pd
# import numpy as np
# from scipy.stats import pearsonr, spearmanr, kendalltau
# from sklearn.metrics import pairwise_distances
# import streamlit as st

# def _partial_correlation(x, y, controls_df):
#     """
#     Compute partial correlation between x and y controlling for controls_df
#     via regression residuals.
#     """
#     # Prepare design matrix with intercept
#     X = controls_df.values
#     X = np.column_stack([np.ones(len(X)), X])
#     # Regress x
#     beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
#     res_x = x.values - X.dot(beta_x)
#     # Regress y
#     beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
#     res_y = y.values - X.dot(beta_y)
#     # Correlate residuals
#     return pearsonr(res_x, res_y)

# def calculate(data, selected_columns, headers, additional_data={}):
#     """
#     data: list of rows (lists)
#     selected_columns: list of ints
#     headers: list of column names
#     additional_data: dict with keys:
#       - method: 'bivariate', 'partial', or 'distances'
#       - group1: list of ints
#       - group2: list of ints (optional)
#       - controls: list of ints (for partial)
#     """
#     try:
#         if not data:
#             return "No data provided."
#         # Build DataFrame
#         df = pd.DataFrame(data, columns=headers[:len(data[0])])
#         method = additional_data.get('method', 'bivariate')
#         group1 = additional_data.get('group1', [])
#         group2 = additional_data.get('group2', [])
#         controls = additional_data.get('controls', [])
#         names1 = [headers[i] for i in group1 if i < len(headers)]
#         names2 = [headers[i] for i in group2 if i < len(headers)]
#         ctrl_names = [headers[i] for i in controls if i < len(headers)]

#         # Convert columns to numeric
#         for col in set(names1 + names2 + ctrl_names):
#             df[col] = pd.to_numeric(df[col], errors='coerce')

#         # Drop rows with NaNs in any selected column
#         cols_to_drop = names1 + names2 + ctrl_names
#         clean = df.dropna(subset=cols_to_drop)
#         if len(clean) < 2:
#             return "Insufficient complete data (need ≥2 rows)."

#         result_html = "<div style='font-family: Arial;'>"

#         # # Bivariate correlation
#         # if method == 'bivariate':
#         #     cols_a = names1
#         #     cols_b = names2 or names1
#         #     for i, a in enumerate(cols_a):
#         #         for j, b in enumerate(cols_b):
#         #             if cols_b is cols_a and j <= i:
#         #                 continue
#         #             x, y = clean[a], clean[b]
#         #             if x.nunique()<2 or y.nunique()<2:
#         #                 result_html += f"<p><strong>{a} vs {b}:</strong> Insufficient variation.</p>"
#         #                 continue
#         #             r, p = pearsonr(x, y)
#         #             strength = ("Strong" if abs(r)>=0.7 else
#         #                         "Moderate" if abs(r)>=0.3 else
#         #                         "Weak" if abs(r)>=0.1 else "None")
#         #             dirn = "Positive" if r>0 else "Negative" if r<0 else "None"
#         #             result_html += (
#         #                 f"<div style='margin:8px 0;padding:8px;"
#         #                 "background:#e3f2fd;border-left:4px solid #1976d2;'>"
#         #                 f"<strong>{a} vs {b} (Pearson):</strong><br>"
#         #                 f"r = {r:.4f}, p = {p:.4f}<br>"
#         #                 f"Strength: {strength} ({dirn})"
#         #                 "</div>"
#                     # )

        
#         # Bivariate correlation (matrix style)
#         if method == 'bivariate':
#             cols = names1 if not names2 else list(set(names1 + names2))
#             n = len(cols)

#             # Prepare correlation and p-value matrices
#             corr_matrix = np.full((n, n), np.nan)
#             pval_matrix = np.full((n, n), np.nan)

#             for i in range(n):
#                 for j in range(n):
#                     a, b = cols[i], cols[j]
#                     x, y = clean[a], clean[b]
#                     if x.nunique() < 2 or y.nunique() < 2:
#                         continue
#                     r, p = pearsonr(x, y)
#                     corr_matrix[i, j] = r
#                     pval_matrix[i, j] = p

#             # Render matrix table
#             result_html += "<p><strong>Correlation Matrix (Pearson):</strong></p>"
#             result_html += "<table border='1' cellpadding='4'><tr><th></th>"
#             result_html += "".join(f"<th>{col}</th>" for col in cols)
#             result_html += "</tr>"

#             for i in range(n):
#                 result_html += f"<tr><th>{cols[i]}</th>"
#                 for j in range(n):
#                     r = corr_matrix[i, j]
#                     p = pval_matrix[i, j]
#                     if np.isnan(r):
#                         result_html += "<td></td>"
#                     else:
#                         result_html += f"<td>r={r:.2f}<br>p={p:.4f}</td>"
#                 result_html += "</tr>"
#             # result_html += "</table>"
#             # return """
#             #     <div style='font-family: Arial;'>
#             #     <h3>Correlation Matrix</h3>
#             #     <table border='1' cellpadding='4'>
#             #         <tr><th></th><th>A</th><th>B</th></tr>
#             #         <tr><th>A</th><td>r=1.00<br>p=0.0000</td><td>r=0.85<br>p=0.0032</td></tr>
#             #         <tr><th>B</th><td>r=0.85<br>p=0.0032</td><td>r=1.00<br>p=0.0000</td></tr>
#             #     </table>
#             #     </div>
#             #     """

#             result_html = """

#                 <tr><th></th><th>A</th><th>B</th></tr>
#                 <tr><th>A</th><td>r=1.00<br>p=0.0000</td><td>r=0.85<br>p=0.0032</td></tr>
#                 <tr><th>B</th><td>r=0.85<br>p=0.0032</td><td>r=1.00<br>p=0.0000</td></tr>
#             </table>
        
#             </div>
#             """
#             st.markdown(result_html, unsafe_allow_html=True)


#         # Partial correlation
#         elif method == 'partial':
#             if not ctrl_names:
#                 return "Select control variables for partial correlation."
#             cols = names1 + names2 or names1
#             for i, a in enumerate(cols):
#                 for j, b in enumerate(cols):
#                     if j <= i:
#                         continue
#                     x, y = clean[a], clean[b]
#                     ctrl_df = clean[ctrl_names]
#                     try:
#                         r, p = _partial_correlation(x, y, ctrl_df)
#                     except Exception as e:
#                         result_html += (
#                             f"<p><strong>{a} vs {b} partial:</strong> Error: {e}</p>"
#                         )
#                         continue
#                     strength = ("Strong" if abs(r)>=0.7 else
#                                 "Moderate" if abs(r)>=0.3 else
#                                 "Weak" if abs(r)>=0.1 else "None")
#                     dirn = "Positive" if r>0 else "Negative" if r<0 else "None"
#                     result_html += (
#                         f"<div style='margin:8px 0;padding:8px;"
#                         "background:#e1f5fe;border-left:4px solid #0288d1;'>"
#                         f"<strong>{a} vs {b} (Partial):</strong><br>"
#                         f"r = {r:.4f}, p = {p:.4f}<br>"
#                         f"Strength: {strength} ({dirn})"
#                         "</div>"
#                     )

#         # Pairwise distances
#         elif method == 'distances':
#             cols = names1 + names2
#             arr = clean[cols].to_numpy()
#             dist = pairwise_distances(arr, metric='euclidean')
#             # Table header
#             result_html += "<p><strong>Euclidean Distances:</strong></p>"
#             result_html += "<table border='1' cellpadding='4'><tr><th></th>"
#             result_html += "".join(f"<th>Obs {i+1}</th>" for i in range(dist.shape[0]))
#             result_html += "</tr>"
#             for i, row in enumerate(dist):
#                 result_html += "<tr>"
#                 result_html += f"<th>Obs {i+1}</th>"
#                 result_html += "".join(f"<td>{val:.2f}</td>" for val in row)
#                 result_html += "</tr>"
#             result_html += "</table>"

#         else:
#             result_html += f"<p>Unknown method: {method}</p>"

#         result_html += "</div>"
#         return result_html

#     except Exception as ex:
#         return f"<div style='color:red;font-family:Arial;'>Error: {ex}</div>"
    












# 1.


# # calculations/correlation.py

# import pandas as pd
# import numpy as np
# from scipy.stats import pearsonr
# from sklearn.metrics import pairwise_distances

# def _partial_correlation(x, y, controls_df):
#     """
#     Compute partial correlation between x and y controlling for controls_df
#     via regression residuals.
#     Returns (r, p)
#     """
#     # Prepare design matrix with intercept
#     X = controls_df.values
#     if X.ndim == 1:
#         X = X.reshape(-1, 1)
#     X = np.column_stack([np.ones(len(X)), X])
#     # Regress x
#     beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
#     res_x = x.values - X.dot(beta_x)
#     # Regress y
#     beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
#     res_y = y.values - X.dot(beta_y)
#     # Correlate residuals
#     return pearsonr(res_x, res_y)


# def calculate(data, selected_columns, headers, additional_data={}):
#     """
#     Entrypoint used by the Flask app.
#     - data: list of rows (lists)
#     - selected_columns: unused by this UI (we receive groups via additional_data)
#     - headers: list of column names
#     - additional_data:
#         - method: 'bivariate', 'partial', or 'distances'
#         - group1: list of ints (indices)
#         - group2: list of ints (indices, optional)
#         - controls: list of ints (indices, for partial)
#     Returns: HTML string
#     """
#     try:
#         if not data:
#             return "<div style='font-family: Arial; color: #d32f2f;'>No data provided.</div>"

#         # Build DataFrame using the number of columns in the first row
#         df = pd.DataFrame(data, columns=headers[:len(data[0])])

#         method = additional_data.get('method', 'bivariate')
#         group1 = additional_data.get('group1', [])
#         group2 = additional_data.get('group2', [])
#         controls = additional_data.get('controls', [])

#         names1 = [headers[i] for i in group1 if i < len(headers)]
#         names2 = [headers[i] for i in group2 if i < len(headers)]
#         ctrl_names = [headers[i] for i in controls if i < len(headers)]

#         # Convert selected columns to numeric where applicable
#         for col in set(names1 + names2 + ctrl_names):
#             df[col] = pd.to_numeric(df[col], errors='coerce')

#         # Basic checks
#         if method == 'bivariate':
#             if not names1:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Select at least one variable in Group 1.</div>"
#             if not names2 and len(names1) < 2:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Select at least two variables in Group 1 or pick variables in Group 2.</div>"

#         if method == 'partial' and not ctrl_names:
#             return "<div style='font-family: Arial; color: #d32f2f;'>Partial correlation requires at least one control variable.</div>"

#         result_html = "<div style='font-family: Arial;'>"

#         # ----------------------------
#         # BIVARIATE: matrix output
#         # ----------------------------
#         if method == 'bivariate':
#             if names2:
#                 # Rectangular matrix: rows = names1, cols = names2
#                 rows = names1
#                 cols = names2
#                 result_html += "<p><strong>Correlation (Pearson) — Group1 vs Group2</strong></p>"
#                 result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"

#                 for rname in rows:
#                     result_html += f"<tr><th>{rname}</th>"
#                     for cname in cols:
#                         pair = df[[rname, cname]].dropna()
#                         if pair.shape[0] < 2 or pair[rname].nunique() < 2 or pair[cname].nunique() < 2:
#                             result_html += "<td style='text-align:center;'>—</td>"
#                         else:
#                             r, p = pearsonr(pair[rname], pair[cname])
#                             result_html += f"<td style='text-align:center;'>r={r:.4f}<br>p={p:.4f}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"

#             else:
#                 # Symmetric matrix of names1
#                 cols = list(names1)
#                 n = len(cols)
#                 if n < 2:
#                     return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two variables for a correlation matrix.</div>"

#                 result_html += "<p><strong>Correlation Matrix (Pearson)</strong></p>"
#                 result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"

#                 for i, a in enumerate(cols):
#                     result_html += f"<tr><th>{a}</th>"
#                     for j, b in enumerate(cols):
#                         if i == j:
#                             # diag
#                             result_html += "<td style='text-align:center;'>r=1.0000<br>p=0.0000</td>"
#                         else:
#                             pair = df[[a, b]].dropna()
#                             if pair.shape[0] < 2 or pair[a].nunique() < 2 or pair[b].nunique() < 2:
#                                 result_html += "<td style='text-align:center;'>—</td>"
#                             else:
#                                 r, p = pearsonr(pair[a], pair[b])
#                                 result_html += f"<td style='text-align:center;'>r={r:.4f}<br>p={p:.4f}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"

#         # ----------------------------
#         # PARTIAL: symmetric matrix across combined cols
#         # ----------------------------
#         elif method == 'partial':
#             cols = (names1 + names2) if names2 else list(names1)
#             # remove duplicates while preserving order
#             seen = set()
#             cols = [c for c in cols if not (c in seen or seen.add(c))]
#             if len(cols) < 2:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two target variables for partial correlation.</div>"

#             result_html += "<p><strong>Partial Correlation Matrix (controlling for: {})</strong></p>".format(", ".join(ctrl_names))
#             result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#             result_html += "".join(f"<th>{c}</th>" for c in cols)
#             result_html += "</tr>"

#             for i, a in enumerate(cols):
#                 result_html += f"<tr><th>{a}</th>"
#                 for j, b in enumerate(cols):
#                     if i == j:
#                         result_html += "<td style='text-align:center;'>—</td>"
#                         continue
#                     pair_plus_ctrl = df[[a, b] + ctrl_names].dropna()
#                     if pair_plus_ctrl.shape[0] < 2 or pair_plus_ctrl[a].nunique() < 2 or pair_plus_ctrl[b].nunique() < 2:
#                         result_html += "<td style='text-align:center;'>—</td>"
#                         continue
#                     try:
#                         r, p = _partial_correlation(pair_plus_ctrl[a], pair_plus_ctrl[b], pair_plus_ctrl[ctrl_names])
#                         result_html += f"<td style='text-align:center;'>r={r:.4f}<br>p={p:.4f}</td>"
#                     except Exception as e:
#                         result_html += f"<td style='text-align:center;'>Err</td>"
#                 result_html += "</tr>"
#             result_html += "</table>"

#         # ----------------------------
#         # DISTANCES: pairwise distances between observations using selected columns
#         # ----------------------------
#         elif method == 'distances':
#             cols = names1 + names2
#             if not cols:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Select variables for distance calculation.</div>"
#             arr = df[cols].apply(pd.to_numeric, errors='coerce').dropna().to_numpy()
#             if arr.shape[0] < 1:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Insufficient complete observations for distance calculation.</div>"

#             dist = pairwise_distances(arr, metric='euclidean')
#             result_html += "<p><strong>Euclidean Distances (observations):</strong></p>"
#             result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#             result_html += "".join(f"<th>Obs {i+1}</th>" for i in range(dist.shape[0]))
#             result_html += "</tr>"
#             for i, row in enumerate(dist):
#                 result_html += "<tr>"
#                 result_html += f"<th>Obs {i+1}</th>"
#                 result_html += "".join(f"<td style='text-align:center;'>{val:.4f}</td>" for val in row)
#                 result_html += "</tr>"
#             result_html += "</table>"

#         else:
#             result_html += f"<p>Unknown method: {method}</p>"

#         result_html += "</div>"
#         return result_html

#     except Exception as ex:
#         return f"<div style='color:red;font-family:Arial;'>Error computing correlation: {ex}</div>"















# 2. 


# # calculations/correlation.py

# import pandas as pd
# import numpy as np
# from scipy.stats import pearsonr
# from sklearn.metrics import pairwise_distances

# def _partial_correlation(x, y, controls_df):
#     """
#     Compute partial correlation between x and y controlling for controls_df
#     via regression residuals.
#     Returns (r, p)
#     """
#     # Prepare design matrix with intercept
#     X = controls_df.values
#     if X.ndim == 1:
#         X = X.reshape(-1, 1)
#     X = np.column_stack([np.ones(len(X)), X])
#     # Regress x
#     beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
#     res_x = x.values - X.dot(beta_x)
#     # Regress y
#     beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
#     res_y = y.values - X.dot(beta_y)
#     # Correlate residuals
#     return pearsonr(res_x, res_y)


# def calculate(data, selected_columns, headers, additional_data={}):
#     """
#     Entrypoint used by the Flask app.
#     - data: list of rows (lists)
#     - selected_columns: unused by this UI (we receive groups via additional_data)
#     - headers: list of column names
#     - additional_data:
#         - method: 'bivariate', 'partial', or 'distances'
#         - group1: list of ints (indices)
#         - group2: list of ints (indices, optional)
#         - controls: list of ints (indices, for partial)
#     Returns: HTML string
#     """
#     try:
#         if not data:
#             return "<div style='font-family: Arial; color: #d32f2f;'>No data provided.</div>"

#         # Build DataFrame using the number of columns in the first row
#         df = pd.DataFrame(data, columns=headers[:len(data[0])])

#         method = additional_data.get('method', 'bivariate')
#         group1 = additional_data.get('group1', [])
#         group2 = additional_data.get('group2', [])
#         controls = additional_data.get('controls', [])

#         names1 = [headers[i] for i in group1 if i < len(headers)]
#         names2 = [headers[i] for i in group2 if i < len(headers)]
#         ctrl_names = [headers[i] for i in controls if i < len(headers)]

#         # Convert selected columns to numeric where applicable
#         for col in set(names1 + names2 + ctrl_names):
#             df[col] = pd.to_numeric(df[col], errors='coerce')

#         # Basic checks
#         if method == 'bivariate':
#             if not names1:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Select at least one variable in Group 1.</div>"
#             if not names2 and len(names1) < 2:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Select at least two variables in Group 1 or pick variables in Group 2.</div>"

#         if method == 'partial' and not ctrl_names:
#             return "<div style='font-family: Arial; color: #d32f2f;'>Partial correlation requires at least one control variable.</div>"

#         result_html = ""

#         # ----------------------------
#         # BIVARIATE: matrix output
#         # ----------------------------
#         if method == 'bivariate':
#             if names2:
#                 # Rectangular matrix: rows = names1, cols = names2
#                 rows = names1
#                 cols = names2
#                 result_html += "<p><strong>Correlation (Pearson) — Group1 vs Group2</strong></p>"
#                 result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"

#                 for rname in rows:
#                     result_html += f"<tr><th>{rname}</th>"
#                     for cname in cols:
#                         pair = df[[rname, cname]].dropna()
#                         n = int(pair.shape[0])
#                         if n >= 2 and pair[rname].nunique() > 1 and pair[cname].nunique() > 1:
#                             r, p = pearsonr(pair[rname], pair[cname])
#                             result_html += f"<td style='text-align:center;'>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                         else:
#                             # show available N (even if not enough to compute)
#                             if n == 0:
#                                 result_html += "<td style='text-align:center;'>—</td>"
#                             else:
#                                 result_html += f"<td style='text-align:center;'>—<br>N={n}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"

#             else:
#                 # Symmetric matrix of names1
#                 cols = list(names1)
#                 nvars = len(cols)
#                 if nvars < 2:
#                     return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two variables for a correlation matrix.</div>"

#                 result_html += "<p>Pearson</p>"
#                 # result_html += "<table<tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"

#                 for i, a in enumerate(cols):
#                     result_html += f"<tr><th>{a}</th>"
#                     for j, b in enumerate(cols):
#                         if i == j:
#                             n_diag = int(df[a].dropna().shape[0])
#                             # diagonal still report N
#                             if n_diag > 0:
#                                 result_html += f"<td r=1.0000<br>p=0.0000<br>N={n_diag}</td>"
#                             else:
#                                 result_html += "<td>—</td>"
#                         else:
#                             pair = df[[a, b]].dropna()
#                             n = int(pair.shape[0])
#                             if n >= 2 and pair[a].nunique() > 1 and pair[b].nunique() > 1:
#                                 r, p = pearsonr(pair[a], pair[b])
#                                 result_html += f"<td r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                             else:
#                                 if n == 0:
#                                     result_html += "<td>—</td>"
#                                 else:
#                                     result_html += f"<td>—<br>N={n}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"

#         # ----------------------------
#         # PARTIAL: symmetric matrix across combined cols
#         # ----------------------------
#         elif method == 'partial':
#             cols = (names1 + names2) if names2 else list(names1)
#             # remove duplicates while preserving order
#             seen = set()
#             cols = [c for c in cols if not (c in seen or seen.add(c))]
#             if len(cols) < 2:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two target variables for partial correlation.</div>"

#             result_html += "<p><strong>Partial<br>Correlation-(controlling<br>for:{})</strong></p>".format(", ".join(ctrl_names))
#             # result_html += "<table<tr><th></th>"
#             result_html += "".join(f"<th>{c}</th>" for c in cols)
#             result_html += "</tr>"

#             for i, a in enumerate(cols):
#                 result_html += f"<tr><th>{a}</th>"
#                 for j, b in enumerate(cols):
#                     if i == j:
#                         n_diag = int(df[a].dropna().shape[0])
#                         if n_diag > 0:
#                             result_html += f"<td>—<br>N={n_diag}</td>"
#                         else:
#                             result_html += "<td>—</td>"
#                         continue
#                     pair_plus_ctrl = df[[a, b] + ctrl_names].dropna()
#                     n = int(pair_plus_ctrl.shape[0])
#                     if n >= 2 and pair_plus_ctrl[a].nunique() > 1 and pair_plus_ctrl[b].nunique() > 1:
#                         try:
#                             r, p = _partial_correlation(pair_plus_ctrl[a], pair_plus_ctrl[b], pair_plus_ctrl[ctrl_names])
#                             result_html += f"<td>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                         except Exception:
#                             result_html += f"<td>Err<br>N={n}</td>"
#                     else:
#                         if n == 0:
#                             result_html += "<td>—</td>"
#                         else:
#                             result_html += f"<td>—<br>N={n}</td>"
#                 result_html += "</tr>"
#             result_html += "</table>"

#         # ----------------------------
#         # DISTANCES: pairwise distances between observations using selected columns
#         # ----------------------------
#         # elif method == 'distances':
#         #     cols = names1 + names2
#         #     if not cols:
#         #         return "<div style='font-family: Arial; color: #d32f2f;'>Select variables for distance calculation.</div>"
#         #     arr_df = df[cols].apply(pd.to_numeric, errors='coerce').dropna()
#         #     arr = arr_df.to_numpy()
#         #     n_obs = int(arr.shape[0])
#         #     if n_obs < 1:
#         #         return "<div style='font-family: Arial; color: #d32f2f;'>Insufficient complete observations for distance calculation.</div>"

#         #     dist = pairwise_distances(arr, metric='euclidean')
#         #     result_html += f"<p>Euclidean-Distances<br>(observations (N)={n_obs})</p>"
#         #     # result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#         #     result_html += "".join(f"<th>Obs {i+1}</th>" for i in range(dist.shape[0]))
#         #     result_html += "</tr>"
#         #     for i, row in enumerate(dist):
#         #         result_html += "<tr>"
#         #         result_html += f"<th>Obs {i+1}</th>"
#         #         result_html += "".join(f"<td>{val:.4f}</td>" for val in row)
#         #         result_html += "</tr>"
#         #     result_html += "</table>"

#         # else:
#         #     result_html += f"<p>Unknown method: {method}</p>"









# import pandas as pd
# import numpy as np
# from scipy.stats import pearsonr, spearmanr
# from sklearn.metrics import pairwise_distances

# def _partial_correlation(x, y, controls_df):
#     X = controls_df.values
#     if X.ndim == 1:
#         X = X.reshape(-1, 1)
#     X = np.column_stack([np.ones(len(X)), X])
#     beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
#     res_x = x.values - X.dot(beta_x)
#     beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
#     res_y = y.values - X.dot(beta_y)
#     return pearsonr(res_x, res_y)

# def calculate(data, selected_columns, headers, additional_data={}):
#     try:
#         if not data:
#             return "<div style='font-family: Arial; color: #d32f2f;'>No data provided.</div>"

#         df = pd.DataFrame(data, columns=headers[:len(data[0])])

#         method = additional_data.get('method', 'bivariate')
#         submethod = additional_data.get('submethod', None)
#         group1 = additional_data.get('group1', [])
#         group2 = additional_data.get('group2', [])
#         controls = additional_data.get('controls', [])

#         names1 = [headers[i] for i in group1 if i < len(headers)]
#         names2 = [headers[i] for i in group2 if i < len(headers)]
#         ctrl_names = [headers[i] for i in controls if i < len(headers)]

#         for col in set(names1 + names2 + ctrl_names):
#             df[col] = pd.to_numeric(df[col], errors='coerce')

#         result_html = ""


#         if method == 'bivariate':
#             corr_func = pearsonr if submethod != "spearman" else spearmanr
#             label = "Pearson" if submethod != "spearman" else "Spearman"

#             if names2:
#                 rows, cols = names1, names2
#                 result_html += f"<p><strong>Correlation ({label}) — Group1 vs Group2</strong></p>"
#                 result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"
#                 for rname in rows:
#                     result_html += f"<tr><th>{rname}</th>"
#                     for cname in cols:
#                         pair = df[[rname, cname]].dropna()
#                         n = int(pair.shape[0])
#                         if n >= 2 and pair[rname].nunique() > 1 and pair[cname].nunique() > 1:
#                             r, p = corr_func(pair[rname], pair[cname])
#                             result_html += f"<td style='text-align:center;'>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                         else:
#                             result_html += "<td>—</td>" if n == 0 else f"<td>—<br>N={n}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"

#             else:
#                 cols = list(names1)
#                 if len(cols) < 2:
#                     return "<div style='color:#d32f2f;'>Need at least two variables.</div>"

#                 result_html += f"<p><strong>{label}-Correlation</strong></p>"
#                 result_html += "<table <tr><th></th>"
#                 result_html += "".join(f"<th>{c}</th>" for c in cols)
#                 result_html += "</tr>"

#                 for i, a in enumerate(cols):
#                     result_html += f"<tr><th>{a}</th>"
#                     for j, b in enumerate(cols):
#                         if i == j:
#                             n_diag = int(df[a].dropna().shape[0])
#                             result_html += f"<td>r=1.0000<br>p=0.0000<br>N={n_diag}</td>"
#                         else:
#                             pair = df[[a, b]].dropna()
#                             n = int(pair.shape[0])
#                             if n >= 2 and pair[a].nunique() > 1 and pair[b].nunique() > 1:
#                                 r, p = corr_func(pair[a], pair[b])
#                                 result_html += f"<td>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                             else:
#                                 result_html += "<td>—</td>" if n == 0 else f"<td>—<br>N={n}</td>"
#                     result_html += "</tr>"
#                 result_html += "</table>"




#         elif method == 'partial':
#             cols = (names1 + names2) if names2 else list(names1)
#             # remove duplicates while preserving order
#             seen = set()
#             cols = [c for c in cols if not (c in seen or seen.add(c))]
#             if len(cols) < 2:
#                 return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two target variables for partial correlation.</div>"

#             result_html += "<p><strong>Partial-Correlation<br>(controlling-for:-{})</strong></p>".format(", ".join(ctrl_names))
#             result_html += "<table <tr><th></th>"
#             result_html += "".join(f"<th>{c}</th>" for c in cols)
#             result_html += "</tr>"

#             for i, a in enumerate(cols):
#                 result_html += f"<tr><th>{a}</th>"
#                 for j, b in enumerate(cols):
#                     if i == j:
#                         n_diag = int(df[a].dropna().shape[0])
#                         if n_diag > 0:
#                             result_html += f"<td>—<br>N={n_diag}</td>"
#                         else:
#                             result_html += "<td>—</td>"
#                         continue
#                     pair_plus_ctrl = df[[a, b] + ctrl_names].dropna()
#                     n = int(pair_plus_ctrl.shape[0])
#                     if n >= 2 and pair_plus_ctrl[a].nunique() > 1 and pair_plus_ctrl[b].nunique() > 1:
#                         try:
#                             r, p = _partial_correlation(pair_plus_ctrl[a], pair_plus_ctrl[b], pair_plus_ctrl[ctrl_names])
#                             result_html += f"<td>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
#                         except Exception:
#                             result_html += f"<td>Err<br>N={n}</td>"
#                     else:
#                         result_html += "<td>—</td>" if n == 0 else f"<td>—<br>N={n}</td>"
#                 result_html += "</tr>"
#             result_html += "</table>"

#     # ----------------------------
#     # DISTANCES
#     # ----------------------------
#         elif method == 'distances':
#             cols = names1 + names2
#             if not cols:
#                 return "<div style='color:#d32f2f;'>Select variables for distance calculation.</div>"
#             arr_df = df[cols].apply(pd.to_numeric, errors='coerce').dropna()
#             if arr_df.shape[0] < 1:
#                 return "<div style='color:#d32f2f;'>Insufficient complete observations.</div>"

#             arr = arr_df.to_numpy()
#             if submethod == "varwise":
#                 dist = pairwise_distances(arr.T, metric="euclidean")
#                 labels = cols
#                 title = "Variable-wise Distances"
#             else:
#                 dist = pairwise_distances(arr, metric="euclidean")
#                 # labels = [f"Obs {i+1}" for i in arr_df.index]
#                 labels = [str(i+1) for i in range(len(arr_df))]
#                 title = "Case-wise Distances"

#             result_html += f"<p><strong>{title}</strong></p>"
#             result_html += "<table <tr><th></th>"
#             result_html += "".join(f"<th>{c}</th>" for c in labels) + "</tr>"

#             for i, row in enumerate(dist):
#                 result_html += f"<tr><th>{labels[i]}</th>"
#                 result_html += "".join(f"<td>{val:.4f}</td>" for val in row)
#                 result_html += "</tr>"
#             result_html += "</table>"





#         return result_html

#     except Exception as ex:
#         return f"<div>Error computing correlation: {ex}</div>"














# calculations/correlation.py

import pandas as pd
import numpy as np
from scipy.stats import pearsonr, spearmanr
from sklearn.metrics import pairwise_distances

def _partial_correlation(x, y, controls_df):
    X = controls_df.values
    if X.ndim == 1:
        X = X.reshape(-1, 1)
    X = np.column_stack([np.ones(len(X)), X])
    beta_x, *_ = np.linalg.lstsq(X, x.values, rcond=None)
    res_x = x.values - X.dot(beta_x)
    beta_y, *_ = np.linalg.lstsq(X, y.values, rcond=None)
    res_y = y.values - X.dot(beta_y)
    return pearsonr(res_x, res_y)

def calculate(data, selected_columns, headers, additional_data={}):
    try:
        if not data:
            return "<div style='font-family: Arial; color: #d32f2f;'>No data provided.</div>"

        df = pd.DataFrame(data, columns=headers[:len(data[0])])

        method = additional_data.get('method', 'bivariate')
        submethod = additional_data.get('submethod', None)
        group1 = additional_data.get('group1', [])
        group2 = additional_data.get('group2', [])
        controls = additional_data.get('controls', [])

        names1 = [headers[i] for i in group1 if i < len(headers)]
        names2 = [headers[i] for i in group2 if i < len(headers)]
        ctrl_names = [headers[i] for i in controls if i < len(headers)]

        for col in set(names1 + names2 + ctrl_names):
            df[col] = pd.to_numeric(df[col], errors='coerce')

        result_html = ""

        # helper to create export-friendly hidden table
        def build_export_table(title, header_row, body_rows):
            """
            title: string (not used inside table, kept for clarity)
            header_row: list of header strings (first cell usually empty)
            body_rows: list of lists (each row must have same length as header_row)
            returns HTML table string with style display:none
            """
            html = "<table class='export-table' style='display:none;border-collapse:collapse;border:1px solid #ccc;'>"
            # header
            html += "<tr>"
            for h in header_row:
                html += f"<th>{h}</th>"
            html += "</tr>"
            # body
            for r in body_rows:
                html += "<tr>"
                for cell in r:
                    html += f"<td>{cell}</td>"
                html += "</tr>"
            html += "</table>"
            return html

        # ----------------------------
        # BIVARIATE
        # ----------------------------
        if method == 'bivariate':
            corr_func = pearsonr if submethod != "spearman" else spearmanr
            label = "Pearson" if submethod != "spearman" else "Spearman"

            if names2:
                rows, cols = names1, names2
                result_html += f"<p><strong>Correlation ({label}) — Group1 vs Group2</strong></p>"
                result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
                result_html += "".join(f"<th>{c}</th>" for c in cols)
                result_html += "</tr>"
                # For export table
                export_header = [""] + cols
                export_body = []

                for rname in rows:
                    result_html += f"<tr><th>{rname}</th>"
                    export_row = [rname]
                    for cname in cols:
                        pair = df[[rname, cname]].dropna()
                        n = int(pair.shape[0])
                        if n >= 2 and pair[rname].nunique() > 1 and pair[cname].nunique() > 1:
                            r, p = corr_func(pair[rname], pair[cname])
                            cell_text = f"r={r:.4f}<br>p={p:.4f}<br>N={n}"
                            export_cell = f"r={r:.4f}; p={p:.4f}; N={n}"
                            result_html += f"<td style='text-align:center;'>{cell_text}</td>"
                        else:
                            if n == 0:
                                result_html += "<td>—</td>"
                                export_cell = "—"
                            else:
                                result_html += f"<td style='text-align:center;'>—<br>N={n}</td>"
                                export_cell = f"—; N={n}"
                        export_row.append(export_cell)
                    export_body.append(export_row)
                    result_html += "</tr>"
                result_html += "</table>"
                # append hidden export table


                result_html += build_export_table(f"Correlation {label} Group1 vs Group2", export_header, export_body)

            else:
                cols = list(names1)
                if len(cols) < 2:
                    return "<div style='color:#d32f2f;'>Need at least two variables.</div>"

                result_html += f"<p><strong>{label}-Correlation</strong></p>"
                result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
                result_html += "".join(f"<th>{c}</th>" for c in cols)
                result_html += "</tr>"

                # prepare export table
                export_header = [""] + cols
                export_body = []

                for i, a in enumerate(cols):
                    result_html += f"<tr><th>{a}</th>"
                    export_row = [a]
                    for j, b in enumerate(cols):
                        if i == j:
                            n_diag = int(df[a].dropna().shape[0])
                            result_html += f"<td>r=1.0000<br>p=0.0000<br>N={n_diag}</td>"
                            export_cell = f"r=1.0000; p=0.0000; N={n_diag}"
                        else:
                            pair = df[[a, b]].dropna()
                            n = int(pair.shape[0])
                            if n >= 2 and pair[a].nunique() > 1 and pair[b].nunique() > 1:
                                r, p = corr_func(pair[a], pair[b])
                                result_html += f"<td>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
                                export_cell = f"r={r:.4f}; p={p:.4f}; N={n}"
                            else:
                                if n == 0:
                                    result_html += "<td>—</td>"
                                    export_cell = "—"
                                else:
                                    result_html += f"<td>—<br>N={n}</td>"
                                    export_cell = f"—; N={n}"
                        export_row.append(export_cell)
                    export_body.append(export_row)
                    result_html += "</tr>"
                result_html += "</table>"
                # append hidden export table
                result_html += build_export_table(f"{label} Correlation Matrix", export_header, export_body)


        # ----------------------------
        # PARTIAL
        # ----------------------------
        elif method == 'partial':
            cols = (names1 + names2) if names2 else list(names1)
            # remove duplicates while preserving order
            seen = set()
            cols = [c for c in cols if not (c in seen or seen.add(c))]
            if len(cols) < 2:
                return "<div style='font-family: Arial; color: #d32f2f;'>Need at least two target variables for partial correlation.</div>"

            result_html += "<p><strong>Partial-Correlation<br>(controlling-for:-{})</strong></p>".format(", ".join(ctrl_names))
            result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
            result_html += "".join(f"<th>{c}</th>" for c in cols)
            result_html += "</tr>"

            # prepare export table
            export_header = [""] + cols
            export_body = []

            for i, a in enumerate(cols):
                result_html += f"<tr><th>{a}</th>"
                export_row = [a]
                for j, b in enumerate(cols):
                    if i == j:
                        n_diag = int(df[a].dropna().shape[0])
                        if n_diag > 0:
                            result_html += f"<td>—<br>N={n_diag}</td>"
                            export_cell = f"—; N={n_diag}"
                        else:
                            result_html += "<td>—</td>"
                            export_cell = "—"
                        export_row.append(export_cell)
                        continue
                    pair_plus_ctrl = df[[a, b] + ctrl_names].dropna()
                    n = int(pair_plus_ctrl.shape[0])
                    if n >= 2 and pair_plus_ctrl[a].nunique() > 1 and pair_plus_ctrl[b].nunique() > 1:
                        try:
                            r, p = _partial_correlation(pair_plus_ctrl[a], pair_plus_ctrl[b], pair_plus_ctrl[ctrl_names])
                            result_html += f"<td>r={r:.4f}<br>p={p:.4f}<br>N={n}</td>"
                            export_cell = f"r={r:.4f}; p={p:.4f}; N={n}"
                        except Exception:
                            result_html += f"<td>Err<br>N={n}</td>"
                            export_cell = f"Err; N={n}"
                    else:
                        result_html += "<td>—</td>" if n == 0 else f"<td>—<br>N={n}</td>"
                        export_cell = "—" if n == 0 else f"—; N={n}"
                    export_row.append(export_cell)
                export_body.append(export_row)
                result_html += "</tr>"
            result_html += "</table>"
            # append hidden export table
            result_html += build_export_table("Partial Correlation (export)", export_header, export_body)

    # ----------------------------
    # DISTANCES
    # ----------------------------
        elif method == 'distances':
            cols = names1 + names2
            if not cols:
                return "<div style='color:#d32f2f;'>Select variables for distance calculation.</div>"
            arr_df = df[cols].apply(pd.to_numeric, errors='coerce').dropna()
            if arr_df.shape[0] < 1:
                return "<div style='color:#d32f2f;'>Insufficient complete observations.</div>"

            arr = arr_df.to_numpy()
            if submethod == "varwise":
                dist = pairwise_distances(arr.T, metric="euclidean")
                labels = cols
                title = "Variable-wise Distances"
            else:
                dist = pairwise_distances(arr, metric="euclidean")
                # labels = [f"Obs {i+1}" for i in arr_df.index]
                labels = [str(i+1) for i in range(len(arr_df))]
                title = "Case-wise Distances"

            result_html += f"<p><strong>{title}</strong></p>"
            result_html += "<table border='1' cellpadding='6' style='border-collapse:collapse;'><tr><th></th>"
            result_html += "".join(f"<th>{c}</th>" for c in labels) + "</tr>"

            # prepare export table
            export_header = [""] + labels
            export_body = []

            for i, row in enumerate(dist):
                result_html += f"<tr><th>{labels[i]}</th>"
                export_row = [labels[i]]
                for val in row:
                    result_html += f"<td>{val:.4f}</td>"
                    export_row.append(f"{val:.4f}")
                export_body.append(export_row)
                result_html += "</tr>"
            result_html += "</table>"
            # append hidden export table (pure numeric)
            result_html += build_export_table(f"{title} (export)", export_header, export_body)


        return result_html

    except Exception as ex:
        return f"<div>Error computing correlation: {ex}</div>"
