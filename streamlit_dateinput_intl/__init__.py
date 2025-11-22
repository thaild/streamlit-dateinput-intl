import streamlit as st
from datetime import date, datetime
from typing import Optional, Callable, Any


streamlit_dateinput_intl_component = st.components.v2.component(
    "streamlit-dateinput-intl.streamlit_dateinput_intl",
    js="index-*.js",
    css="index-*.css",
    html='<div class="react-root"></div>',
)

def streamlit_dateinput_intl(
    value: Any = "today",
    min: Optional[Any] = None,
    max: Optional[Any] = None,
    key: Optional[str] = None,
    onChange: Optional[Callable] = None,
    locale: Optional[str] = None,
    *,
    format: str = "YYYY/MM/DD",
    disabled: bool = False,
    width: str = "stretch",
    clearable: bool = False,
):
    """Create a new instance of "streamlit_dateinput_intl".

    Parameters
    ----------
    value: date, datetime, str, or "today"
        The value of this widget when it first renders. Defaults to "today".
        Can be a date, datetime, ISO format string, or "today".
    min: date, datetime, str, or None
        The minimum selectable date. If None, there is no minimum.
    max: date, datetime, str, or None
        The maximum selectable date. If None, there is no maximum.
    key: str or None
        An optional key that uniquely identifies this component.
    onChange: callable or None
        An optional callback invoked when this date input's value changes.
    locale: str or None
        The locale of the date input. Defaults to "en-US".
    format: str
        The format string for displaying the date. Defaults to "YYYY/MM/DD".
    disabled: bool
        Whether this date input is disabled. Defaults to False.
    width: str
        The width of the component. Defaults to "stretch".
    clearable: bool
        Whether this date input is clearable. Defaults to False.
    Returns
    -------
    date or None
        The selected date, or None if no date is selected.
    """
    # Parse date values
    parsed_value = to_iso_string(value)
    parsed_min = to_iso_string(min)
    parsed_max = to_iso_string(max)

    # Prepare data to send to frontend
    data = {
        "value": parsed_value,
        "min": parsed_min,
        "max": parsed_max,
        "format": format,
        "locale": locale,
        "onChange": onChange,
        "disabled": disabled,
        "width": width,
        "clearable": clearable,
    }

    # Call the component
    # The component returns the date value (string or None)
    component_value = streamlit_dateinput_intl_component(
        key=key,
        data=data
    )

    # Handle the returned value
    # It could be a string (ISO date), None, or a dict (if state is returned)
    if component_value is None:
        return None

    # If it's a dict (state object), extract the value
    if isinstance(component_value, dict):
        component_value = component_value.get("value", component_value)

    # Parse the returned value back to a date if it's a string
    if isinstance(component_value, str):
        try:
            return datetime.fromisoformat(component_value).date()
        except (ValueError, AttributeError):
            # If parsing fails, try to parse as date string
            try:
                return datetime.strptime(component_value, "%Y-%m-%d").date()
            except (ValueError, AttributeError):
                return component_value

    return None

# date/datetimeオブジェクトをISO文字列形式に変換
def to_iso_string(d: Optional[Any]) -> Optional[str]:
    if d is None:
        return None
    if isinstance(d, str):
        return d
    if isinstance(d, datetime):
        return d.date().isoformat()
    if isinstance(d, date):
        return d.isoformat()
    return None
