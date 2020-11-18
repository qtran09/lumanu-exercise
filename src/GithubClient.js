export class GithubClient
{
    static async AddRepo(owner, repo)
    {
        let repoList = JSON.parse(localStorage.getItem("repos"));
        if(repoList === null) repoList = [];
        const latestRelease = await this.GetLatestRelease(owner,repo);
        if(latestRelease === null)
        {
            return false;
        }
        const toAdd = {repoOwner : owner, repoName : repo, latestRelease: latestRelease["tag_name"], latestReleaseDate :latestRelease["created_at"], hasRead: true};
        repoList.push(toAdd);
        localStorage.setItem("repos",JSON.stringify(repoList));
        return true;
    }
    static async GetLatestRelease(owner, repo)
    {
            const response = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/releases/latest');
            const json = await response.json();
            if(json['message'] === 'Not Found') return null;
            return json;

    }

    static async IsLatestVersion(owner, repo, version)
    {
        const latest = await this.GetLatestRelease(owner,repo);
        return version === latest["tag_name"];
    }
}