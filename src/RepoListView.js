import React from 'react';
import styles from './RepoListView.module.css';
import { GithubClient } from './GithubClient.js';
export class RepoListView extends React.Component {
    constructor(props) {
        super(props);
        this.state =
        {
            addOwner: "",
            addRepo: "",
            repoList: []
        };
        this.refreshRepos = this.refreshRepos.bind(this);
    }

    async componentDidMount() {
        let list = localStorage.getItem("repos");
        if (list !== null) {
            list = JSON.parse(list);
            list.forEach(async element => {
                let latestUpdate = await GithubClient.GetLatestRelease(element['repoOwner'], element['repoName']);
                let hasSeen = await GithubClient.IsLatestVersion(element['repoOwner'], element['repoName'], element['latestRelease'])
                if (!hasSeen) {
                    element['latestRelease'] = latestUpdate['tag_name'];
                    element['latestReleaseDate'] = latestUpdate['created_at'];
                    element['hasRead'] = false;
                    localStorage.setItem("repos", JSON.stringify(list));
                }

            });
            this.setState({ repoList: JSON.parse(localStorage.getItem("repos")) });
        }
    }

    onRepoAdd = async (e) => {
        e.preventDefault();
        let success = await GithubClient.AddRepo(this.state.addOwner, this.state.addRepo);
        if (success) {
            this.setState({ repoList: JSON.parse(localStorage.getItem("repos")) });
        }
        else {
            alert("Could not add repo");
        }

    }


    onRepoClick(repoObj) {
        this.state.repoList.forEach(element => {
            if (element === repoObj && !repoObj['hasRead']) {
                element['hasRead'] = true;
                localStorage.setItem("repos", JSON.stringify(this.state.repoList));
            }
        });
        this.setState({ repoList: this.state.repoList });
    }
    refreshRepos() {
        if (localStorage.getItem('repos') !== null) {
            this.setState({ repoList: JSON.parse(localStorage.getItem("repos")) });
        }
    }

    render() {
        return (
            <div className={styles.repo}>
                <h3 className={styles.repoListTitle}>Repo List</h3>
                <ul className={styles.repoList}>
                    {this.state !== null && this.state.repoList !== null ? this.state.repoList.map((repoObj, index) => {
                        let date = new Date(repoObj['latestReleaseDate']);
                        return (
                            <li key={index} className={styles.repoListItem} onClick={() => this.onRepoClick(repoObj)}>
                                <div className={styles.repoBigText}>
                                    {!repoObj['hasRead'] && "NEW"}
                                </div>
                                <div className={styles.repoBigText}>
                                    {repoObj['latestRelease']}
                                </div>
                                <div className={styles.repoMediumText}>
                                    {date.toDateString()}
                                </div>
                                <div className={styles.repoNameText}>
                                    {repoObj["repoName"]}
                                </div>
                            </li>
                        )
                    }) : <></>
                    }
                </ul>
                <div className={styles.refresh} onClick={this.refreshRepos}>Refresh Repo Data</div>
                <h3 className={styles.addRepoTitle}>Add Repo</h3>
                <form className={styles.addRepoForm} onSubmit={this.onRepoAdd}>
                    <input type="text" placeholder="Owner" onChange={e => this.setState({ addOwner: e.target.value })} />
                    <input type="text" placeholder="Repository" onChange={e => this.setState({ addRepo: e.target.value })} />
                    <input type="submit" value="Add Repo" />
                </form>
            </div>
        );
    }
}