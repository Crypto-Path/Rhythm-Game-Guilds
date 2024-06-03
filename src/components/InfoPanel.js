import * as React from "react";

export const InfoPanel = () => {
    return (
        <>
            <div className="info-panel search-container main-element">
                <h1>Rhythm Game Guilds</h1>
                This site focuses on sharing information about Quaver guilds and comparing stats of users and their guilds.
                <h2>What is underlord/overlord?</h2>
                These are custom progression stages inspired by the <a href="https://www.worldanvil.com/w/cradle-fallenredn/a/levels-of-advancement-article">stages of progression in Will Wright's novel, Cradle</a>.
                <h2>Contributions</h2>
                <div className="contributions">
                    <a href ="https://github.com/Crypto-Path/RhythmGameQuildData">Want to contribute information?</a>
                    <a href ="https://github.com/Crypto-Path/Rhythm-Game-Guilds">Want to contribute to development?</a>
                    <span>Created by <a href ="https://cyphemercury.online/">Cyphe Mercury</a>, <a href="https://zoe.rip">ooquaria</a>, and <a href ="https://discord.gg/quaver">The Quaver Community</a>.</span>
                    <span>Quaver Guilds is not affiliated with <a href ="https://quavergame.com/team">The Quaver Team</a> in any way.</span>
                </div>
            </div>
        </>
    )
}