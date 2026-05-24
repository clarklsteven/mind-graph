import { describe, it, expect } from 'vitest';
import * as styles from './styles';

describe('styles utilities', () => {
    it('should return the correct active and inactive button styles', () => {
        expect(styles.getButtonStyle(true)).toEqual({
            width: '100%',
            padding: '10px 12px',
            textAlign: 'center',
            border: '1px solid rgb(160, 150, 140)',
            borderRadius: '8px',
            backgroundColor: 'rgb(101, 26, 44)',
            color: 'rgb(255, 250, 231)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
        });

        expect(styles.getButtonStyle(false)).toEqual({
            width: '100%',
            padding: '10px 12px',
            textAlign: 'center',
            border: '1px solid rgb(160, 150, 140)',
            borderRadius: '8px',
            backgroundColor: 'rgb(255, 250, 231)',
            color: 'rgb(70, 50, 60)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
        });
    });

    it('should return the correct secondary button style', () => {
        expect(styles.getSecondaryButtonStyle()).toEqual({
            width: '100%',
            padding: '10px 12px',
            textAlign: 'center',
            border: '1px solid rgb(160, 150, 140)',
            borderRadius: '8px',
            backgroundColor: 'rgb(255, 250, 231)',
            color: 'rgb(70, 50, 60)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
        });
    });

    it('should return the correct danger button style', () => {
        expect(styles.getDangerButtonStyle()).toEqual({
            width: '100%',
            padding: '10px 12px',
            textAlign: 'center',
            border: '1px solid rgb(140, 70, 70)',
            borderRadius: '8px',
            backgroundColor: 'rgb(240, 220, 220)',
            color: 'rgb(120, 30, 30)',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
        });
    });

    it('should return the correct property label style', () => {
        expect(styles.getPropertyLabelStyle()).toEqual({
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgb(120, 110, 100)',
            marginBottom: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
        });
    });

    it('should return the correct property input style', () => {
        expect(styles.getPropertyInputStyle()).toEqual({
            width: '100%',
            padding: '8px 10px',
            border: '1px solid rgb(210, 205, 190)',
            borderRadius: '8px',
            backgroundColor: 'rgb(255, 250, 231)',
            color: 'rgb(70, 50, 60)',
            fontSize: '14px',
            boxSizing: 'border-box',
        });
    });

    it('should return the correct property display style', () => {
        expect(styles.getPropertyDisplayStyle()).toEqual({
            padding: '8px 10px',
            border: '1px solid rgb(210, 205, 190)',
            borderRadius: '8px',
            backgroundColor: 'rgb(236, 231, 214)',
            color: 'rgb(140, 135, 130)',
            fontFamily: 'monospace',
            fontSize: '13px',
        });
    });

    it('should return the correct property dropdown style', () => {
        expect(styles.getPropertyDropdownStyle()).toEqual({
            width: '100%',
            padding: '8px 10px',
            border: '1px solid rgb(210, 205, 190)',
            borderRadius: '8px',
            backgroundColor: 'rgb(255, 250, 231)',
            color: 'rgb(70, 50, 60)',
            fontSize: '14px',
            boxSizing: 'border-box',
        });
    });

    it('should return the correct modal styles', () => {
        expect(styles.getModalOverlayStyle()).toEqual({
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        });

        expect(styles.getModalContentStyle()).toEqual({
            width: '480px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflowY: 'auto',
            backgroundColor: '#fffaf0',
            border: '1px solid #d6c7a1',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            padding: '16px',
        });

        expect(styles.getModalHeaderStyle()).toEqual({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
        });

        expect(styles.getModalTitleStyle()).toEqual({
            fontSize: '18px',
            fontWeight: 600,
            color: '#651A2C',
        });

        expect(styles.getModalCloseButtonStyle()).toEqual({
            border: 'none',
            background: 'transparent',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#651A2C',
        });

        expect(styles.getModalBodyStyle()).toEqual({
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
        });
    });

    it('should return the correct help styles', () => {
        expect(styles.getScrollableHelpStyle()).toEqual({
            maxHeight: '60vh',
            overflowY: 'auto',
            lineHeight: 1.5,
        });

        expect(styles.getHelpContainerStyle()).toEqual({
            display: 'flex',
            justifyContent: 'flex-start',
        });

        expect(styles.getHelpButtonStyle(true)).toEqual({
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid #651A2C',
            backgroundColor: '#f2eee2',
            color: '#b0a58a',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            fontSize: '14px',
            lineHeight: 1,
        });

        expect(styles.getHelpButtonStyle(false)).toEqual({
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid #651A2C',
            backgroundColor: '#fffaf0',
            color: '#651A2C',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            fontSize: '14px',
            lineHeight: 1,
        });
    });

    it('should return the correct panel styles', () => {
        expect(styles.getPanelSectionStyle()).toEqual({
            border: '1px solid #e0d8c8',
            borderRadius: '8px',
            padding: '8px',
            backgroundColor: '#fffae7',
        });

        expect(styles.getStretchyPanelSectionStyle()).toEqual({
            border: '1px solid #e0d8c8',
            borderRadius: '8px',
            padding: '8px',
            backgroundColor: '#fffae7',
            flexGrow: 10,
        });

        expect(styles.getPanelSectionTitleStyle()).toEqual({
            fontSize: '12px',
            fontWeight: 600,
            color: '#7a6a4f',
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
        });

        expect(styles.getPanelSectionContentStyle()).toEqual({
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
        });

        expect(styles.getControlPanelStyle()).toEqual({
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            boxSizing: 'border-box',
            gap: '1px',
        });
    });

    it('should return the correct title styles', () => {
        expect(styles.getMindGraphTitleStyle()).toEqual({
            fontSize: '20px',
            fontWeight: 700,
            color: '#00332a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
        });

        expect(styles.getGraphTitleStyle()).toEqual({
            display: 'flex',
            fontSize: '16px',
            fontWeight: 500,
            color: '#00332a',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
        });
    });
});
