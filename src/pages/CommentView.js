import React, {
    Component
} from 'react';

import {
    Page,
    Card,
    ComplexText,
    Field,
    ListItem,
    Navigation,
    Button,
    Loading,
    Tag
} from 'gtn-soho';

import {
    AppX
} from 'gtn-platform';

export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            button: [
                { icon: 'send', id: 'reply' }  //Navigation buttons
            ]
        };

        Navigation.set(this, {
            title: 'Comment',
        });
    }

    componentWillMount() {
        this.reload();
    }

    willAppear() {
        if (this.state.button) {
            Navigation.set(this, {
                title: 'Comment',
                buttons: this.state.button,
            });
        }
    }

    edit() {
        this.props.navigator.push({
            screen: 'CreateComment',
            passProps: {
                id: this.props.uid,
                reload: this.props.reload,
                comment: this.state.comment
            }
        });
    }

    reply() {
        this.props.navigator.push({
            screen: 'CreateComment',
            passProps: {
                id: this.state.comment.Parent.rootId,
                reload: this.props.reload,
                replyTo: this.state.comment.uid,
                replyBody: this.state.comment.Body,
                replyAuthor: this.state.comment.Author
            }
        });
    }

    reload() {
        AppX.fetch('&comment', this.props.uid).then(result => {
            this.setState({
                comment: result.data
            });

            if (this.state.comment.Author == global.userLogin) {  //if creator of thread
                this.setState({
                    button: [
                        { icon: 'compose', id: 'edit' },
                        { icon: 'send', id: 'reply' }
                    ]
                });

                Navigation.set(this, {
                    title: 'Comment',
                    buttons: this.state.button,
                });
            }
        });

        AppX.fetchAttachList('&comment', this.props.uid).then(({ data }) => {
            if (data) {
                this.setState({ attachments: data.result || [] });
            } else {
                alert('We weren\'t able to load any attachments. Please try again later!');
            }
        });
    }

    async showAttachment(item) {
        this.setState({ loading: true });
        var appx = await AppX.fetchAttachment(item);
        this.setState({ loading: false });
        setTimeout(() => { this.props.navigator.push({ screen: 'ImageDisplay', passProps: { image: appx.data } }); }, 800);
    }

    renderAttach = item => {
        let press = null;
        if (item.mimeType == 'image/jpg' || item.mimeType == 'image/png') {  //if image attachment then show
            press = () => this.showAttachment(item);
        }
        return (
            <ListItem
                key={item.attachmentUid}
                onPress={press}
            >
                <ComplexText
                    main={item.name}
                    secondary={item.description}
                    tertiary={item.createUserId}
                />
            </ListItem >
        );
    }

    render() {
        return (
            <Page>
                {this.state.comment &&
                    <Card>
                        <Field.Row>
                            <Field label='Author' entry={this.state.comment.Author} />
                            <Field label='Author Organization' entry={this.state.comment.AuthorOrg} />
                        </Field.Row>
                        <Field.Row>
                            <Field label='Date Created' entry={this.state.comment.Date} />
                            <Field label='Time Created' entry={this.state.comment.Time} />
                        </Field.Row>
                        <Field label='Body' entry={this.state.comment.Body} />
                    </Card>
                }

                {this.state.comment &&
                    <Card title='Attachments'>
                        {this.state.attachments &&
                            this.state.attachments.map(this.renderAttach)
                        }

                        {this.state.attachments && this.state.attachments.length == 0 &&
                            <ListItem>
                                <ComplexText main='No attachments' />
                            </ListItem>
                        }

                        {this.state.loading &&
                            <Loading block />
                        }
                    </Card>
                }

                {!this.state.comment &&
                    <Card>
                        <Loading />
                    </Card>
                }
            </Page>
        )
    }

}
