import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'billing'
  | 'invoices'
  | 'reports'
  | 'more'
  | 'plus'
  | 'minus'
  | 'barcode'
  | 'cart'
  | 'search'
  | 'customer'
  | 'expense'
  | 'printer'
  | 'share'
  | 'download'
  | 'whatsapp'
  | 'filter'
  | 'bell'
  | 'chevron-right'
  | 'chevron-left'
  | 'chevron-down'
  | 'check'
  | 'close'
  | 'trash'
  | 'edit'
  | 'eye'
  | 'clock'
  | 'calendar'
  | 'phone'
  | 'mail'
  | 'map-pin'
  | 'credit-card'
  | 'qr-code'
  | 'wallet'
  | 'cash'
  | 'bank'
  | 'refresh'
  | 'star'
  | 'trending-up'
  | 'trending-down'
  | 'alert-circle'
  | 'check-circle'
  | 'info'
  | 'table'
  | 'utensils'
  | 'pill'
  | 'tag'
  | 'scissors'
  | 'cpu'
  | 'gem'
  | 'truck'
  | 'users'
  | 'building'
  | 'settings'
  | 'moon'
  | 'sun'
  | 'logout'
  | 'arrow-up-right'
  | 'store'
  | 'receipt'
  | 'shield-check'
  | 'copy';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 22,
  color = '#25282B',
  strokeWidth = 2,
}) => {
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9 21V12H15V21"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'billing':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect
            x="2"
            y="4"
            width="20"
            height="16"
            rx="3"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Path
            d="M2 10H22"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Circle cx="7" cy="15" r="1" fill={color} />
          <Circle cx="12" cy="15" r="1" fill={color} />
          <Circle cx="17" cy="15" r="1" fill={color} />
        </Svg>
      );

    case 'invoices':
    case 'receipt':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 2V21L7 19.5L10 21L13 19.5L16 21L19 19.5L20 20V2C20 2 16 2 12 2C8 2 4 2 4 2Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8 7H16M8 11H16M8 15H13"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'reports':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 20V10M12 20V4M6 20V14"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M3 20H21"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'more':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="5" cy="12" r="2" fill={color} />
          <Circle cx="12" cy="12" r="2" fill={color} />
          <Circle cx="19" cy="12" r="2" fill={color} />
        </Svg>
      );

    case 'cart':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="9" cy="20" r="1.5" fill={color} />
          <Circle cx="18" cy="20" r="1.5" fill={color} />
          <Path
            d="M3 4H5L7 16H19L21 7H6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'barcode':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 5V19M6 5V19M9 5V19M13 5V19M16 5V19M21 5V19"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'search':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle
            cx="11"
            cy="11"
            r="7"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Path
            d="M20 20L16.5 16.5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 5V19M5 12H19"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'minus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 12H19"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'chevron-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 5L16 12L9 19"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'chevron-left':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 19L8 12L15 5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'chevron-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 9L12 15L18 9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 12L9 17L20 6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'close':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 6L6 18M6 6L18 18"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'trash':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 6H21M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Line x1="10" y1="11" x2="10" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="14" y1="11" x2="14" y2="17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'edit':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 4H4C3.44772 4 3 4.44772 3 5V20C3 20.5523 3.44772 21 4 21H19C19.5523 21 20 20.5523 20 20V13M18.5 2.5C19.3284 1.67157 20.6716 1.67157 21.5 2.5C22.3284 3.32843 22.3284 4.67157 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'bell':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'customer':
    case 'users':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx="9"
            cy="7"
            r="4"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Path
            d="M22 21V19C21.9987 18.1136 21.7061 17.2526 21.1685 16.5516C20.6308 15.8506 19.8787 15.3484 19.03 15.12"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 3.13C16.8504 3.35649 17.6053 3.85897 18.1444 4.56158C18.6835 5.26418 18.9772 6.12711 18.9772 7.015C18.9772 7.90289 18.6835 8.76582 18.1444 9.46842C17.6053 10.171 16.8504 10.6735 16 10.9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'printer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 9V2H18V9"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 18H4C3.44772 18 3 17.5523 3 17V11C3 10.4477 3.44772 10 4 10H20C20.5523 10 21 10.4477 21 11V17C21 17.5523 20.5523 18 20 18H18"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Rect
            x="6"
            y="14"
            width="12"
            height="8"
            rx="1"
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Circle cx="18" cy="13" r="1" fill={color} />
        </Svg>
      );

    case 'share':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );

    case 'download':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M7 10L12 15L17 10M12 15V3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'whatsapp':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17.5 6.5C16.1 5 14.1 4 12 4C7.6 4 4 7.6 4 12C4 13.5 4.4 14.9 5.2 16.1L4 21L9.1 19.7C10 20.2 11 20.4 12 20.4C16.4 20.4 20 16.8 20 12.4C20 10.3 19.1 8.2 17.5 6.5Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M9.5 9C9.2 8.4 9 8.4 8.6 8.4C8.4 8.4 8.1 8.4 7.9 8.6C7.6 8.9 7 9.5 7 10.7C7 11.9 7.9 13.1 8 13.3C8.2 13.5 9.7 15.8 12 16.8C13.9 17.6 14.3 17.4 14.7 17.4C15.2 17.3 16.2 16.7 16.4 16.1C16.6 15.5 16.6 15 16.5 14.9C16.4 14.8 16.2 14.7 15.8 14.5C15.4 14.3 13.5 13.4 13.1 13.3C12.8 13.1 12.6 13.1 12.4 13.4C12.1 13.8 11.6 14.5 11.4 14.7C11.3 14.8 11.1 14.9 10.8 14.7C10.5 14.6 9.5 14.3 8.4 13.3C7.5 12.5 6.9 11.5 6.8 11.3C6.6 11 6.8 10.9 6.9 10.8C7.1 10.6 7.2 10.4 7.4 10.2C7.5 10.1 7.6 9.9 7.7 9.8C7.8 9.6 7.7 9.4 7.7 9.3C7.6 9.2 7.1 8 6.9 7.5"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'qr-code':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth={strokeWidth} rx="1" />
          <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth={strokeWidth} rx="1" />
          <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth={strokeWidth} rx="1" />
          <Rect x="5" y="5" width="3" height="3" fill={color} />
          <Rect x="16" y="5" width="3" height="3" fill={color} />
          <Rect x="5" y="16" width="3" height="3" fill={color} />
          <Path d="M14 14H17V17H14V14ZM17 17H21V21H17V17ZM14 19H16V21H14V19ZM19 14H21V16H19V14Z" fill={color} />
        </Svg>
      );

    case 'credit-card':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="5" width="20" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="2" y1="10" x2="22" y2="10" stroke={color} strokeWidth={strokeWidth} />
          <Rect x="5" y="14" width="4" height="2" fill={color} />
        </Svg>
      );

    case 'cash':
    case 'wallet':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="2" y="6" width="20" height="12" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Circle cx="12" cy="12" r="2.5" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M6 12H7M17 12H18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'bank':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 21H21M3 10H21M12 3L2 8H22L12 3Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M5 10V18M9 10V18M15 10V18M19 10V18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'store':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 9L4.5 4H19.5L21 9M3 9V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V9M3 9C3 10.6569 4.34315 12 6 12C7.65685 12 9 10.6569 9 9C9 10.6569 10.3431 12 12 12C13.6569 12 15 10.6569 15 9C15 10.6569 16.3431 12 18 12C19.6569 12 21 10.6569 21 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 21V15H15V21" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'utensils':
    case 'table':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M18 2V20M15 2V8C15 9.1 15.9 10 17 10H19C20.1 10 21 9.1 21 8V2M18 10V20M4 2V10C4 11.1 4.9 12 6 12H7V20M6 2V6M9 2V6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'pill':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10.5 6.5L17.5 13.5M14 3.5L20.5 10C21.8807 11.3807 21.8807 13.6193 20.5 15L15 20.5C13.6193 21.8807 11.3807 21.8807 10 20.5L3.5 14C2.11929 12.6193 2.11929 10.3807 3.5 9L9 3.5C10.3807 2.11929 12.6193 2.11929 14 3.5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'tag':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M20.59 13.41L13.42 20.58C13.047 20.9512 12.5422 21.1594 12.015 21.1594C11.4878 21.1594 10.983 20.9512 10.61 20.58L2 12V2H12L20.59 10.59C20.9612 10.963 21.1694 11.4678 21.1694 11.995C21.1694 12.5222 20.9612 13.027 20.59 13.41Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="7" cy="7" r="1.5" fill={color} />
        </Svg>
      );

    case 'scissors':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="6" cy="6" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="20" y1="4" x2="8.12" y2="15.88" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="14.47" y1="14.48" x2="20" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="8.12" y1="8.12" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'cpu':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Rect x="9" y="9" width="6" height="6" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M9 1V4M15 1V4M9 20V23M15 20V23M20 9H23M20 15H23M1 9H4M1 15H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'gem':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M6 3H18L22 9L12 22L2 9L6 3Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M2 9H22M12 22L8 9L10 3M12 22L16 9L14 3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'truck':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="1" y="3" width="15" height="13" rx="1" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M16 8H20L23 11V16H16V8Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="5.5" cy="18.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
          <Circle cx="18.5" cy="18.5" r="2.5" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );

    case 'trending-up':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M17 6H23V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'trending-down':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M23 18L13.5 8.5L8.5 13.5L1 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M17 18H23V12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'alert-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="12" y1="8" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx="12" cy="16" r="1" fill={color} />
        </Svg>
      );

    case 'check-circle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M8 12L11 15L16 9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
          <Path
            d="M19.4 15A1.65 1.65 0 0 0 20 16.7L20.2 17A2 2 0 0 1 18 20.2L17.7 20A1.65 1.65 0 0 0 16 19.4A1.65 1.65 0 0 0 14.6 20.3L14.4 20.6A2 2 0 0 1 11.4 20.6L11.2 20.3A1.65 1.65 0 0 0 9.8 19.4A1.65 1.65 0 0 0 8.1 20L7.8 20.2A2 2 0 0 1 5.6 17L5.8 16.7A1.65 1.65 0 0 0 5.2 15A1.65 1.65 0 0 0 4.3 13.6L4 13.4A2 2 0 0 1 4 10.4L4.3 10.2A1.65 1.65 0 0 0 5.2 8.8A1.65 1.65 0 0 0 4.6 7.1L4.4 6.8A2 2 0 0 1 7.6 4.6L7.9 4.8A1.65 1.65 0 0 0 9.6 5.4A1.65 1.65 0 0 0 11 4.5L11.2 4.2A2 2 0 0 1 14.2 4.2L14.4 4.5A1.65 1.65 0 0 0 15.8 5.4A1.65 1.65 0 0 0 17.5 4.8L17.8 4.6A2 2 0 0 1 20 7.8L19.8 8.1A1.65 1.65 0 0 0 20.4 9.8A1.65 1.65 0 0 0 21.3 11.2L21.6 11.4A2 2 0 0 1 21.6 14.4L21.3 14.6A1.65 1.65 0 0 0 19.4 15Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'building':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M9 22V18H15V22M8 6H10M14 6H16M8 10H10M14 10H16M8 14H10M14 14H16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'arrow-up-right':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M7 17L17 7M17 7H7M17 7V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'copy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="9" y="9" width="13" height="13" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );

    case 'shield-check':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 22S20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M9 12L11 14L15 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'expense':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5C7 8.88071 8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5C17 13.8807 15.8807 15 14.5 15H7" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'clock':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
          <Path d="M12 6V12L16 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'calendar':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="3" y1="10" x2="21" y2="10" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );

    case 'phone':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4741 21.8325 20.7293C21.7209 20.9845 21.5573 21.2137 21.3521 21.4019C21.1468 21.5901 20.9046 21.733 20.6408 21.8214C20.3769 21.9099 20.0974 21.942 19.82 21.915C16.7428 21.5805 13.787 20.5287 11.19 18.84C8.77382 17.2924 6.74413 15.2443 5.21 12.81C3.51543 10.1979 2.46194 7.22557 2.13 4.135C2.10298 3.85871 2.13483 3.58025 2.22346 3.31737C2.31208 3.05449 2.4555 2.81303 2.64455 2.6083C2.8336 2.40356 3.06404 2.24017 3.32074 2.12879C3.57745 2.01741 3.85469 1.96057 4.134 1.962H7.134C7.6206 1.95759 8.09277 2.13106 8.4604 2.44919C8.82803 2.76732 9.06646 3.20875 9.13 3.692C9.25 4.595 9.47 5.482 9.79 6.342C9.932 6.721 9.907 7.147 9.721 7.505C9.535 7.863 9.204 8.121 8.81 8.216L7.54 8.746C8.973 11.267 11.023 13.317 13.544 14.75L14.074 13.48C14.169 13.086 14.427 12.755 14.785 12.569C15.143 12.383 15.569 12.358 15.948 12.5C16.808 12.82 17.695 13.04 18.598 13.16C19.086 13.224 19.531 13.466 19.851 13.838C20.17 14.209 20.342 14.686 20.334 15.176V16.92Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );

    case 'moon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    case 'sun':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={strokeWidth} />
          <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
        </Svg>
      );

    case 'logout':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M16 17L21 12L16 7M21 12H9" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} />
        </Svg>
      );
  }
};
