import React from "react";

type PanelSectionProps = {
    title?: string;
    children: React.ReactNode;
};

export function PanelSection({ title, children }: PanelSectionProps) {
    return (
        <div className="panel-section">
            {title && (
                <div className="panel-section-title">
                    {title}
                </div>
            )}
            <div className="panel-section-content">
                {children}
            </div>
        </div>
    );
}

export function StretchyPanelSection({ title, children }: PanelSectionProps) {
    return (
        <div className="panel-section panel-section-stretchy">
            {title && (
                <div className="panel-section-title">
                    {title}
                </div>
            )}
            <div className="panel-section-content">
                {children}
            </div>
        </div>
    );
}