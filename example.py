import streamlit as st
from streamlit_dateinput_intl import streamlit_dateinput_intl
from datetime import date, timedelta

# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run example.py`

# Create an instance with default values
# selected_date = streamlit_dateinput_intl()
# st.write(f"Selected date: {selected_date}")

st.subheader("Dete Input International")

# Example with all props
selected_date_full = streamlit_dateinput_intl(
    value="today",
    min=date.today() - timedelta(days=30),
    max=date.today() + timedelta(days=30),
    key="date_input_full",
    format="YYYY/MM/DD",
    disabled=False,
    width="stretch",
    clearable=True,
    locale="ja"
)
st.write(f"Selected date: {selected_date_full}")

# st.markdown("---")
# st.subheader("With custom format")

# Example with custom format
# selected_date_custom = streamlit_dateinput_intl(
#     label="Date with custom format",
#     format="YYYY-MM-DD",
#     key="date_input_custom"
# )
# st.write(f"Selected date: {selected_date_custom}")

# st.markdown("---")
# st.subheader("Default date input")

# # Example with disabled state
selected_date_disabled = st.date_input(
    label="Default date input",
    key="date_input_disabled"
)
st.write(f"Selected date: {selected_date_disabled}")
