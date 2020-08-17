import SearchBar from "../Components/SearchBar/SearchBar";

const clientId = ''
const redirectUrl = 'http://localhost:3000/'
const accessToken;

const Spotify = {
getAccessToken(){
    if (accessToken) {
        return accessToken
    } 
    const userTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if ( userTokenMatch && expiresInMatch) { 
        accessToken = userTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1])

        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken
    }else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`
        window.location = accessUrl
    }
}
search(term){
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {headers: {
        Autorization: `Bearer ${accessToken}`
    }}).then(response => { 
        return response.json())}.then(jsonResponse => {
            if (!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.item.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })

}

}

export default Spotify
