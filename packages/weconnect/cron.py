# /// script
# dependencies = [
#   "weconnect-cupra-daern[Images]==0.50.13",
#   "ipdb==0.13.13",
#   "python-ulid==3.0.0",
# ]
# ///
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional
from datetime import datetime, timezone
import json

from ulid import ULID
from weconnect_cupra import weconnect_cupra
from weconnect_cupra.service import Service

def safe_get(d: Dict[str, Any], *keys: str, default: Any = None) -> Any:
    """Safely get a value from nested dictionaries."""
    current = d
    for key in keys:
        if not isinstance(current, dict):
            return default
        current = current.get(key, default)
        if current is None:
            return default
    return current

def safe_str(value: Any) -> str:
    """Safely convert any value to string."""
    if value is None:
        return None

    valueStr = str(value)
    if '.' in valueStr:
        return valueStr.split('.')[-1]
    
    return valueStr

def get_domain_data(data: Dict[str, Any], domain: str, *keys: str, default: Any = None) -> Any:
    """Helper to get data from a specific domain."""
    return safe_get(data, 'domains', domain, *keys, default=default)

def prepare_vehicle_status(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prepare vehicle status data for database insertion.
    Returns a dictionary with all relevant fields.
    """
    
    def get_charging(*keys: str, default: Any = None) -> Any:
        return get_domain_data(data, 'charging', *keys, default=default)
    
    def get_climate(*keys: str, default: Any = None) -> Any:
        return get_domain_data(data, 'climatisation', *keys, default=default)
    
    def get_access(*keys: str, default: Any = None) -> Any:
        return get_domain_data(data, 'access', *keys, default=default)

    def get_door_status(door: str, attribute: str) -> str:
        return safe_str(safe_get(data, 'domains', 'access', 'accessStatus', 'doors', door, attribute))

    def get_window_status(window: str) -> str:
        return safe_str(safe_get(data, 'domains', 'access', 'accessStatus', 'windows', window, 'openState'))

    status = {
        # Basic info
        'nickname': safe_get(data, 'nickname'),
        
        # Battery & Charging
        'battery_level': get_charging('batteryStatus', 'currentSOC_pct', default=0),
        'range_km': get_charging('batteryStatus', 'cruisingRangeElectric_km', default=0),
        'charging_status': safe_str(get_charging('chargingStatus', 'chargingState')),
        'charging_power_kw': get_charging('chargingStatus', 'chargePower_kW', default=0.0),
        'charging_rate_kmph': get_charging('chargingStatus', 'chargeRate_kmph', default=0.0),
        'plug_status': safe_str(get_charging('plugStatus', 'plugConnectionState')),
        'target_soc': get_charging('chargingSettings', 'targetSOC_pct', default=0),
        'remaining_charging_time': get_charging('chargingStatus', 'remainingChargingTimeToComplete_min', default=0),
        
        # Climate
        'climate_status': safe_str(get_climate('climatisationStatus', 'climatisationState')),
        'target_temp_celsius': get_climate('climatisationSettings', 'targetTemperatureInCelsius', default=0.0),
        'window_heating_front': safe_str(get_climate('windowHeatingStatus', 'windows', 'front', 'windowHeatingState')),
        'window_heating_rear': safe_str(get_climate('windowHeatingStatus', 'windows', 'rear', 'windowHeatingState')),
        
        # Security/Access
        'doors_locked': 1 if safe_str(get_access('accessStatus', 'doorLockStatus')) == 'locked' else 0,
        'doors_front_left': get_door_status('frontLeft', 'openState'),
        'doors_front_right': get_door_status('frontRight', 'openState'),
        'doors_rear_left': get_door_status('rearLeft', 'openState'),
        'doors_rear_right': get_door_status('rearRight', 'openState'),
        'doors_trunk': get_door_status('trunk', 'openState'),
        'doors_hood': get_door_status('hood', 'openState'),
        
        # Windows
        'window_front_left': get_window_status('frontLeft'),
        'window_front_right': get_window_status('frontRight'),
        'window_rear_left': get_window_status('rearLeft'),
        'window_rear_right': get_window_status('rearRight'),
        
        # Other
        'connection_status': safe_str(get_domain_data(data, 'status', 'connectionStatus', 'mode')),
        'odometer_km': get_domain_data(data, 'measurements', 'odometerStatus', 'odometer', default=0)
    }
    
    return status


CREATE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS vehicle_status (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    battery_level INTEGER NOT NULL,
    range_km INTEGER NOT NULL,
    charging_status TEXT NOT NULL,
    charging_power_kw REAL NOT NULL,
    charging_rate_kmph REAL NOT NULL,
    plug_status TEXT NOT NULL,
    target_soc REAL NOT NULL,
    remaining_charging_time INTEGER NOT NULL,
    climate_status TEXT NOT NULL,
    target_temp_celsius REAL NOT NULL,
    window_heating_front TEXT NOT NULL,
    window_heating_rear TEXT NOT NULL,
    doors_locked INTEGER NOT NULL,
    doors_front_left TEXT NOT NULL,
    doors_front_right TEXT NOT NULL,
    doors_rear_left TEXT NOT NULL,
    doors_rear_right TEXT NOT NULL,
    doors_trunk TEXT NOT NULL,
    doors_hood TEXT NOT NULL,
    window_front_left TEXT NOT NULL,
    window_front_right TEXT NOT NULL,
    window_rear_left TEXT NOT NULL,
    window_rear_right TEXT NOT NULL,
    connection_status TEXT NOT NULL,
    odometer_km INTEGER NOT NULL,
    created_at TEXT NOT NULL
) STRICT
"""

INSERT_SQL = """
INSERT INTO vehicle_status (
    id, nickname, battery_level, range_km, charging_status, charging_power_kw,
    charging_rate_kmph, plug_status, target_soc, remaining_charging_time,
    climate_status, target_temp_celsius, window_heating_front, window_heating_rear,
    doors_locked, doors_front_left, doors_front_right, doors_rear_left,
    doors_rear_right, doors_trunk, doors_hood, window_front_left,
    window_front_right, window_rear_left, window_rear_right,
    connection_status, odometer_km, created_at
) VALUES (
    :id, :nickname, :battery_level, :range_km, :charging_status, :charging_power_kw,
    :charging_rate_kmph, :plug_status, :target_soc, :remaining_charging_time,
    :climate_status, :target_temp_celsius, :window_heating_front, :window_heating_rear,
    :doors_locked, :doors_front_left, :doors_front_right, :doors_rear_left,
    :doors_rear_right, :doors_trunk, :doors_hood, :window_front_left,
    :window_front_right, :window_rear_left, :window_rear_right,
    :connection_status, :odometer_km, :created_at
)
"""

def init_database(db_path: str) -> sqlite3.Connection:
    """Initialize SQLite database with optimal settings."""
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    
    max_tries = 5
    for i in range(max_tries):
        try:
            conn = sqlite3.connect(
                db_path,
                isolation_level=None,
                detect_types=sqlite3.PARSE_DECLTYPES | sqlite3.PARSE_COLNAMES
            )
        except Exception as e:
            print(f"Error connecting to database: {e}")
            if i == max_tries - 1:
                raise

            time.sleep(1)
            continue
    
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute(CREATE_TABLE_SQL)
    
    return conn

def insert_vehicle_status(conn: sqlite3.Connection, status: Dict[str, Any]) -> None:
    """Insert vehicle status into database."""
    status['id'] = str(ULID())
    status['created_at'] = datetime.now(timezone.utc).isoformat()
    
    try:
        with conn:  # This creates a transaction
            conn.execute(INSERT_SQL, status)
    except sqlite3.Error as e:
        print(f"Error inserting data: {e}")
        raise

def main():
    db_path = os.path.expanduser(os.environ.get('DATABASE_FILE_PATH'))
    conn = init_database(db_path)
    print(f"#  Cron start at {datetime.now()}")

    print('#  Initialize WeConnect')
    username = os.environ.get('WECONNECT_USERNAME')
    password = os.environ.get('WECONNECT_PASSWORD')
    weConnect = weconnect_cupra.WeConnect(
        username=username,
        password=password,
        updateAfterLogin=False,
        loginOnInit=False,
        service=Service('MyCupra'))

    try:
        print('#  Login')
        weConnect.login()
        print('#  update')
        weConnect.update()
        print('#  Report')
        vehicles = list(weConnect.vehicles.values())
        if len(vehicles) != 1:
            print(f"Error: Expected 1 vehicle, got {len(vehicles)}")
            return

        vehicle_status = prepare_vehicle_status(vehicles[0].asDict())
        print(json.dumps(vehicle_status))
        insert_vehicle_status(conn, vehicle_status)
            
        print('#  done')
    except Exception as e:
        print(f"Error: {e}")
        raise
    finally:
        conn.close()
        print(f"#  Cron end at {datetime.now()}")

if __name__ == '__main__':
    main()
