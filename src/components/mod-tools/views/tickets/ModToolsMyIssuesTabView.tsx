import { IssueMessageData, ReleaseIssuesMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { SendMessageComposer } from '../../../../api';
import { Base, Button, Column, Grid } from '../../../../common';

interface ModToolsMyIssuesTabViewProps
{
    myIssues: IssueMessageData[];
    onIssueHandleClick(issueId: number): void;
}

export const ModToolsMyIssuesTabView: FC<ModToolsMyIssuesTabViewProps> = props =>
{
    const { myIssues = null, onIssueHandleClick = null } = props;

    const onReleaseIssue = (issueId: number) => SendMessageComposer(new ReleaseIssuesMessageComposer([ issueId ]));

    return (
        <Column gap={ 0 } overflow="hidden">
            <Column gap={ 2 }>
                <Grid gap={ 1 } className="text-black fw-bold border-bottom pb-1">
                    <Base style={{color: "var(--test-galaxytext)"}} className="g-col-2">Type</Base>
                    <Base style={{color: "var(--test-galaxytext)"}} className="g-col-3">Room/Player</Base>
                    <Base style={{color: "var(--test-galaxytext)"}} className="g-col-3">Opened</Base>
                    <Base style={{color: "var(--test-galaxytext)"}} className="g-col-2"></Base>
                    <Base style={{color: "var(--test-galaxytext)"}} className="g-col-2"></Base>
                </Grid>
            </Column>
            <Column overflow="auto" className="striped-children" gap={ 0 }>
                { myIssues && (myIssues.length > 0) && myIssues.map(issue =>
                {
                    return (
                        <Grid key={ issue.issueId } gap={ 1 } alignItems="center" className="text-black py-1 border-bottom">
                            <Base style={{color: "var(--test-galaxytext)"}} className="g-col-2">{ issue.categoryId }</Base>
                            <Base style={{color: "var(--test-galaxytext)"}} className="g-col-3">{ issue.reportedUserName }</Base>
                            <Base style={{color: "var(--test-galaxytext)"}} className="g-col-3">{ new Date(Date.now() - issue.issueAgeInMilliseconds).toLocaleTimeString() }</Base>
                            <Base className="g-col-2">
                                <Button variant="primary" onClick={ event => onIssueHandleClick(issue.issueId) }>Handle</Button>
                            </Base>
                            <Base className="g-col-2">
                                <Button variant="danger" onClick={ event => onReleaseIssue(issue.issueId) }>Release</Button>
                            </Base>
                        </Grid>
                    );
                }) }
            </Column>
        </Column>
    );
}
