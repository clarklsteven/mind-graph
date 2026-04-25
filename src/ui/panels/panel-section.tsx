import React from "react";
import { getPanelSectionContentStyle, getPanelSectionStyle, getPanelSectionTitleStyle, getStretchyPanelSectionStyle } from "../utils/styles";

type PanelSectionProps = {
    title?: string;
    children: React.ReactNode;
};

export function PanelSection({ title, children }: PanelSectionProps) {
    return (
        <div style={getPanelSectionStyle()}>
            {title && (
                <div style={getPanelSectionTitleStyle()}>
                    {title}
                </div>
            )}
            <div style={getPanelSectionContentStyle()}>
                {children}
            </div>
        </div>
    );
}

export function StretchyPanelSection({ title, children }: PanelSectionProps) {
    return (
        <div style={getStretchyPanelSectionStyle()}>
            {title && (
                <div style={getPanelSectionTitleStyle()}>
                    {title}
                </div>
            )}
            <div style={getPanelSectionContentStyle()}>
                {children}
            </div>
        </div>
    );
}